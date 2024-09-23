import { tick, untrack } from "svelte";
import { findNextSibling, findPreviousSibling } from "./utils.js";
import { commandScore } from "./command-score.js";
import type { CommandState } from "./types.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import { createContext } from "$lib/internal/createContext.js";
import type { WithRefProps } from "$lib/internal/types.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { afterSleep } from "$lib/internal/afterSleep.js";
import { kbd } from "$lib/internal/kbd.js";
import {
	getAriaDisabled,
	getAriaExpanded,
	getAriaSelected,
	getDataDisabled,
	getDataSelected,
} from "$lib/internal/attrs.js";
import { getFirstNonCommentChild } from "$lib/internal/dom.js";

const ROOT_ATTR = "data-command-root";
const LIST_ATTR = "data-command-list";
const INPUT_ATTR = "data-command-input";
const SEPARATOR_ATTR = "data-command-separator";
const LOADING_ATTR = "data-command-loading";
const EMPTY_ATTR = "data-command-empty";
const GROUP_ATTR = "data-command-group";
const GROUP_ITEMS_ATTR = "data-command-group-items";
const GROUP_HEADING_ATTR = "data-command-group-heading";
const ITEM_ATTR = "data-command-item";
const VALUE_ATTR = `data-value`;
const LIST_VIEWPORT_ATTR = "data-command-list-viewport";
const INPUT_LABEL_ATTR = "data-command-input-label";

const GROUP_SELECTOR = `[${GROUP_ATTR}]`;
const GROUP_ITEMS_SELECTOR = `[${GROUP_ITEMS_ATTR}]`;
const GROUP_HEADING_SELECTOR = `[${GROUP_HEADING_ATTR}]`;
const ITEM_SELECTOR = `[${ITEM_ATTR}]`;
const VALID_ITEM_SELECTOR = `${ITEM_SELECTOR}:not([aria-disabled="true"])`;
const LIST_VIEWPORT_SELECTOR = `[${LIST_VIEWPORT_ATTR}]`;

export function defaultFilter(value: string, search: string, keywords?: string[]): number {
	return commandScore(value, search, keywords);
}

const [setCommandRootContext, getCommandRootContext] =
	createContext<CommandRootState>("Command.Root");

const [setCommandListContext, getCommandListContext] =
	createContext<CommandListState>("Command.List");

export const [setCommandGroupContainerContext, getCommandGroupContainerContext] =
	createContext<CommandGroupContainerState>("Command.Group");

type CommandRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		filter: (value: string, search: string, keywords?: string[]) => number;
		shouldFilter: boolean;
		loop: boolean;
	}> &
		WritableBoxedValues<{
			value: string;
		}>
>;

// eslint-disable-next-line ts/no-explicit-any
type SetState = <K extends keyof CommandState>(key: K, value: CommandState[K], opts?: any) => void;

class CommandRootState {
	allItems = new Set<string>(); // [...itemIds]
	allGroups = new Map<string, Set<string>>(); // groupId → [...itemIds]
	allIds = new Map<string, { value: string; keywords?: string[] }>();
	id: CommandRootStateProps["id"];
	ref: CommandRootStateProps["ref"];
	filter: CommandRootStateProps["filter"];
	shouldFilter: CommandRootStateProps["shouldFilter"];
	loop: CommandRootStateProps["loop"];
	listViewportNode = $state<HTMLElement | null>(null);
	labelNode = $state<HTMLElement | null>(null);
	valueProp: CommandRootStateProps["value"];
	// published state that the components and other things can react to
	commandState = $state.raw<CommandState>(null!);
	// internal state that we mutate in batches and publish to the `state` at once
	#commandState = $state<CommandState>(null!);
	snapshot = () => this.#commandState;
	setState: SetState = (key, value, opts) => {
		if (Object.is(this.#commandState[key], value)) return;
		this.#commandState[key] = value;
		if (key === "search") {
			// Filter synchronously before emitting back to children
			this.#filterItems();
			this.#sort();
			this.#selectFirstItem();
		} else if (key === "value") {
			// opts is a boolean referring to whether it should NOT be scrolled into view
			if (!opts) {
				// Scroll the selected item into view
				this.#scrollSelectedIntoView();
			}
		}
		// notify subscribers that the state has changed
		this.emit();
	};
	emit = () => {
		this.commandState = $state.snapshot(this.#commandState);
	};

	constructor(props: CommandRootStateProps) {
		this.id = props.id;
		this.ref = props.ref;
		this.filter = props.filter;
		this.shouldFilter = props.shouldFilter;
		this.loop = props.loop;
		this.valueProp = props.value;
		const defaultState = {
			/** Value of the search query */
			search: "",
			/** Currnetly selected item value */
			value: this.valueProp.current ?? "",
			filtered: {
				/** The count of all visible items. */
				count: 0,
				/** Map from visible item id to its search store. */
				items: new Map<string, number>(),
				/** Set of groups with at least one visible item. */
				groups: new Set<string>(),
			},
		};
		this.#commandState = defaultState;
		this.commandState = defaultState;

		useRefById({
			id: this.id,
			ref: this.ref,
		});

		$effect(() => {
			this.#commandState.value;
			this.#scrollSelectedIntoView();
		});
	}

	#score = (value: string, keywords?: string[]) => {
		const filter = this.filter.current ?? defaultFilter;
		const score = value ? filter(value, this.#commandState.search, keywords) : 0;
		return score;
	};

	#sort = () => {
		afterSleep(1, () => {
			if (!this.#commandState.search || this.shouldFilter.current === false) return;

			const scores = this.#commandState.filtered.items;

			// sort the groups
			const groups: [string, number][] = [];
			for (const value of this.#commandState.filtered.groups) {
				const items = this.allGroups.get(value);
				let max = 0;
				if (!items) {
					groups.push([value, max]);
					continue;
				}

				// get the max score of the group's items
				for (const item of items!) {
					const score = scores.get(item);
					max = Math.max(score ?? 0, max);
				}
				groups.push([value, max]);
			}

			// Sort items within groups to bottom
			// Sort items outside of groups
			// Sort groups to bottom (pushes all non-grouped items to the top)
			const listInsertionElement = this.listViewportNode;

			const sorted = this.#getValidItems().sort((a, b) => {
				const valueA = a.getAttribute("id");
				const valueB = b.getAttribute("id");
				const scoresA = scores.get(valueA!) ?? 0;
				const scoresB = scores.get(valueB!) ?? 0;
				return scoresB - scoresA;
			});

			for (const item of sorted) {
				const group = item.closest(GROUP_ITEMS_SELECTOR);

				if (group) {
					const itemToAppend =
						item.parentElement === group
							? item
							: item.closest(`${GROUP_ITEMS_SELECTOR} > *`);

					if (itemToAppend) {
						group.appendChild(itemToAppend);
					}
				} else {
					const itemToAppend =
						item.parentElement === listInsertionElement
							? item
							: item.closest(`${GROUP_ITEMS_SELECTOR} > *`);

					if (itemToAppend) {
						listInsertionElement?.appendChild(itemToAppend);
					}
				}
			}

			const sortedGroups = groups.sort((a, b) => b[1] - a[1]);

			for (const group of sortedGroups) {
				const element = listInsertionElement?.querySelector(
					`${GROUP_SELECTOR}[${VALUE_ATTR}="${encodeURIComponent(group[0])}"]`
				);
				element?.parentElement?.appendChild(element);
			}
		});
	};

	setValue = (value: string, opts?: boolean) => {
		this.setState("value", value, opts);
		this.valueProp.current = value;
	};

	#selectFirstItem = () => {
		afterSleep(1, () => {
			const item = this.#getValidItems().find(
				(item) => item.getAttribute("aria-disabled") !== "true"
			);
			const value = item?.getAttribute(VALUE_ATTR);
			this.setValue(value || "");
		});
	};

	#filterItems = () => {
		if (!this.#commandState.search || this.shouldFilter.current === false) {
			this.#commandState.filtered.count = this.allItems.size;
			return;
		}

		// reset the groups
		this.#commandState.filtered.groups = new Set();
		let itemCount = 0;

		// Check which items should be included
		for (const id of this.allItems) {
			const value = this.allIds.get(id)?.value ?? "";
			const keywords = this.allIds.get(id)?.keywords ?? [];
			const rank = this.#score(value, keywords);
			this.#commandState.filtered.items.set(id, rank);
			if (rank > 0) itemCount++;
		}

		// Check which groups have at least 1 item shown
		for (const [groupId, group] of this.allGroups) {
			for (const itemId of group) {
				const currItem = this.#commandState.filtered.items.get(itemId);

				if (currItem && currItem > 0) {
					this.#commandState.filtered.groups.add(groupId);
					break;
				}
			}
		}

		this.#commandState.filtered.count = itemCount;
	};

	#getValidItems = () => {
		const node = this.ref.current;
		if (!node) return [];
		const validItems = Array.from(
			node.querySelectorAll<HTMLElement>(VALID_ITEM_SELECTOR)
		).filter((el): el is HTMLElement => !!el);
		return validItems;
	};

	#getSelectedItem = () => {
		const node = this.ref.current;
		if (!node) return;
		const selectedNode = node.querySelector<HTMLElement>(
			`${VALID_ITEM_SELECTOR}[aria-selected="true"]`
		);
		if (!selectedNode) return;
		return selectedNode;
	};

	#scrollSelectedIntoView = () => {
		afterSleep(1, () => {
			const item = this.#getSelectedItem();
			if (!item) return;
			const firstChildOfParent = getFirstNonCommentChild(item.parentElement);
			if (firstChildOfParent === item) {
				item
					?.closest(GROUP_SELECTOR)
					?.querySelector(GROUP_HEADING_SELECTOR)
					?.scrollIntoView({ block: "nearest" });
			}
			item.scrollIntoView({ block: "nearest" });
		});
	};

	#updateSelectedToIndex = (index: number) => {
		const items = this.#getValidItems();
		const item = items[index];
		if (item) {
			this.setValue(item.getAttribute(VALUE_ATTR) ?? "");
		}
	};

	#updateSelectedByItem = (change: 1 | -1) => {
		const selected = this.#getSelectedItem();
		const items = this.#getValidItems();
		const index = items.findIndex((item) => item === selected);

		// Get item at this index
		let newSelected = items[index + change];

		if (this.loop.current) {
			newSelected =
				index + change < 0
					? items[items.length - 1]
					: index + change === items.length
						? items[0]
						: items[index + change];
		}

		if (newSelected) {
			this.setValue(newSelected.getAttribute(VALUE_ATTR) ?? "");
		}
	};

	#updateSelectedByGroup = (change: 1 | -1) => {
		const selected = this.#getSelectedItem();
		let group = selected?.closest(GROUP_SELECTOR);
		let item: HTMLElement | null | undefined;

		while (group && !item) {
			group =
				change > 0
					? findNextSibling(group, GROUP_SELECTOR)
					: findPreviousSibling(group, GROUP_SELECTOR);
			item = group?.querySelector(VALID_ITEM_SELECTOR);
		}

		if (item) {
			this.setValue(item.getAttribute(VALUE_ATTR) ?? "");
		} else {
			this.#updateSelectedByItem(change);
		}
	};

	// keep id -> { value, keywords } mapping up to date
	registerValue = (id: string, value: string, keywords?: string[]) => {
		if (value === this.allIds.get(id)?.value) return;
		this.allIds.set(id, { value, keywords });
		this.#commandState.filtered.items.set(id, this.#score(value, keywords));
		afterSleep(1, () => {
			this.#sort();
			this.emit();
		});

		return () => {
			this.allIds.delete(id);
		};
	};

	registerItem = (id: string, groupId: string | undefined) => {
		this.allItems.add(id);

		// Track this item within the group
		if (groupId) {
			if (!this.allGroups.has(groupId)) {
				this.allGroups.set(groupId, new Set([id]));
			} else {
				this.allGroups.get(groupId)!.add(id);
			}
		}

		afterSleep(1, () => {
			this.#filterItems();
			this.#sort();

			// Could be initial mount, select the first item if none already selected
			if (!this.commandState.value) {
				this.#selectFirstItem();
			}

			this.emit();
		});

		return () => {
			this.allIds.delete(id);
			this.allItems.delete(id);
			this.commandState.filtered.items.delete(id);
			const selectedItem = this.#getSelectedItem();

			afterSleep(1, () => {
				this.#filterItems();

				// The item removed have been the selected one,
				// so selection should be moved to the first
				if (selectedItem?.getAttribute("id") === id) this.#selectFirstItem();

				this.emit();
			});
		};
	};

	registerGroup = (id: string) => {
		if (!this.allGroups.has(id)) {
			this.allGroups.set(id, new Set());
		}

		return () => {
			this.allIds.delete(id);
			this.allGroups.delete(id);
		};
	};

	#last = () => {
		return this.#updateSelectedToIndex(this.#getValidItems().length - 1);
	};

	#next = (e: KeyboardEvent) => {
		e.preventDefault();

		if (e.metaKey) {
			this.#last();
		} else if (e.altKey) {
			this.#updateSelectedByGroup(1);
		} else {
			this.#updateSelectedByItem(1);
		}
	};

	#prev = (e: KeyboardEvent) => {
		e.preventDefault();

		if (e.metaKey) {
			// First item
			this.#updateSelectedToIndex(0);
		} else if (e.altKey) {
			// Previous group
			this.#updateSelectedByGroup(-1);
		} else {
			// Previous item
			this.#updateSelectedByItem(-1);
		}
	};

	#onkeydown = (e: KeyboardEvent) => {
		switch (e.key) {
			case kbd.ARROW_DOWN:
				this.#next(e);
				break;
			case kbd.ARROW_UP:
				this.#prev(e);
				break;
			case kbd.HOME:
				// first item
				e.preventDefault();
				this.#updateSelectedToIndex(0);
				break;
			case kbd.END:
				// last item
				e.preventDefault();
				this.#last();
				break;
			case kbd.ENTER: {
				e.preventDefault();
				const item = this.#getSelectedItem();
				if (item) {
					item?.click();
				}
			}
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				role: "application",
				[ROOT_ATTR]: "",
				tabindex: -1,
				onkeydown: this.#onkeydown,
			}) as const
	);

	createEmpty(props: CommandEmptyStateProps) {
		return new CommandEmptyState(props, this);
	}

	createGroupContainer(props: CommandGroupContainerStateProps) {
		return new CommandGroupContainerState(props, this);
	}

	createInput(props: CommandInputStateProps) {
		return new CommandInputState(props, this);
	}

	createItem(props: CommandItemStateProps) {
		return new CommandItemState(props, this);
	}

	createSeparator(props: CommandSeparatorStateProps) {
		return new CommandSeparatorState(props, this);
	}

	createList(props: CommandListStateProps) {
		return new CommandListState(props, this);
	}

	createLabel(props: CommandLabelStateProps) {
		return new CommandLabelState(props, this);
	}
}

type CommandEmptyStateProps = WithRefProps;

class CommandEmptyState {
	#ref: CommandEmptyStateProps["ref"];
	#id: CommandEmptyStateProps["id"];
	#root: CommandRootState;
	#isInitialRender = true;
	shouldRender = $derived.by(
		() => this.#root.commandState.filtered.count === 0 && this.#isInitialRender === false
	);

	constructor(props: CommandEmptyStateProps, root: CommandRootState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#root = root;

		$effect(() => {
			this.#isInitialRender = false;
		});

		useRefById({
			id: this.#id,
			ref: this.#ref,
			condition: () => this.shouldRender,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "presentation",
				[EMPTY_ATTR]: "",
			}) as const
	);
}

type CommandGroupContainerStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
		forceMount: boolean;
	}>
>;

class CommandGroupContainerState {
	#ref: CommandGroupContainerStateProps["ref"];
	id: CommandGroupContainerStateProps["id"];
	forceMount: CommandGroupContainerStateProps["forceMount"];
	#value: CommandGroupContainerStateProps["value"];
	#root: CommandRootState;
	headingNode = $state<HTMLElement | null>(null);

	shouldRender = $derived.by(() => {
		if (this.forceMount.current) return true;
		if (this.#root.shouldFilter.current === false) return true;
		if (!this.#root.commandState.search) return true;
		return this.#root.commandState.filtered.groups.has(this.id.current);
	});
	trueValue = $state("");

	constructor(props: CommandGroupContainerStateProps, root: CommandRootState) {
		this.#ref = props.ref;
		this.id = props.id;
		this.#root = root;
		this.forceMount = props.forceMount;
		this.#value = props.value;
		this.trueValue = props.value.current;

		useRefById({
			id: this.id,
			ref: this.#ref,
			condition: () => this.shouldRender,
		});

		$effect(() => {
			return this.#root.registerGroup(this.id.current);
		});

		$effect(() => {
			if (this.#value.current) {
				this.trueValue = this.#value.current;
				return this.#root.registerValue(this.id.current, this.#value.current);
			} else if (this.headingNode && this.headingNode.textContent) {
				this.trueValue = this.headingNode.textContent.trim().toLowerCase();
				return this.#root.registerValue(this.id.current, this.trueValue);
			} else if (this.#ref.current?.textContent) {
				this.trueValue = this.#ref.current.textContent.trim().toLowerCase();
				return this.#root.registerValue(this.id.current, this.trueValue);
			}
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				role: "presentation",
				hidden: this.shouldRender ? undefined : true,
				"data-value": this.trueValue,
				[GROUP_ATTR]: "",
			}) as const
	);

	createGroupHeading(props: CommandGroupHeadingStateProps) {
		return new CommandGroupHeadingState(props, this);
	}

	createGroupItems(props: CommandGroupItemsStateProps) {
		return new CommandGroupItemsState(props, this);
	}
}

type CommandGroupHeadingStateProps = WithRefProps;

class CommandGroupHeadingState {
	#ref: CommandGroupHeadingStateProps["ref"];
	#id: CommandGroupHeadingStateProps["id"];
	#group: CommandGroupContainerState;

	constructor(props: CommandGroupHeadingStateProps, group: CommandGroupContainerState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#group = group;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#group.headingNode = node;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[GROUP_HEADING_ATTR]: "",
			}) as const
	);
}

type CommandGroupItemsStateProps = WithRefProps;

class CommandGroupItemsState {
	#ref: CommandGroupItemsStateProps["ref"];
	#id: CommandGroupItemsStateProps["id"];
	#group: CommandGroupContainerState;

	constructor(props: CommandGroupItemsStateProps, group: CommandGroupContainerState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#group = group;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "group",
				[GROUP_ITEMS_ATTR]: "",
				"aria-labelledby": this.#group.headingNode?.id ?? undefined,
			}) as const
	);
}

type CommandInputStateProps = WithRefProps<
	WritableBoxedValues<{
		value: string;
	}> &
		ReadableBoxedValues<{
			autofocus: boolean;
		}>
>;

class CommandInputState {
	#ref: CommandInputStateProps["ref"];
	#id: CommandInputStateProps["id"];
	#root: CommandRootState;
	#value: CommandInputStateProps["value"];
	#autofocus: CommandInputStateProps["autofocus"];

	#selectedItemId = $derived.by(() => {
		const item = this.#root.listViewportNode?.querySelector<HTMLElement>(
			`${ITEM_SELECTOR}[${VALUE_ATTR}="${encodeURIComponent(this.#value.current)}"]`
		);
		if (!item) return;
		return item?.getAttribute("id") ?? undefined;
	});

	constructor(props: CommandInputStateProps, root: CommandRootState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#root = root;
		this.#value = props.value;
		this.#autofocus = props.autofocus;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		$effect(() => {
			const node = this.#ref.current;
			untrack(() => {
				if (node && this.#autofocus.current) {
					afterSleep(10, () => node.focus());
				}
			});
		});

		$effect(() => {
			this.#value.current;
			untrack(() => {
				if (this.#root.commandState.search !== this.#value.current) {
					this.#root.setState("search", this.#value.current);
				}
			});
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				type: "text",
				[INPUT_ATTR]: "",
				autocomplete: "off",
				autocorrect: "off",
				spellcheck: false,
				"aria-autocomplete": "list",
				role: "combobox",
				"aria-expanded": getAriaExpanded(true),
				"aria-controls": this.#root.listViewportNode?.id ?? undefined,
				"aria-labelledby": this.#root.labelNode?.id ?? undefined,
				"aria-activedescendant": this.#selectedItemId, // TODO
			}) as const
	);
}

type CommandItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
		disabled: boolean;
		onSelect: () => void;
		forceMount: boolean;
		keywords: string[];
	}> & {
		group: CommandGroupContainerState | null;
	}
>;

class CommandItemState {
	#ref: CommandItemStateProps["ref"];
	id: CommandItemStateProps["id"];
	root: CommandRootState;
	#value: CommandItemStateProps["value"];
	#disabled: CommandItemStateProps["disabled"];
	#onSelectProp: CommandItemStateProps["onSelect"];
	#forceMount: CommandItemStateProps["forceMount"];
	#group: CommandGroupContainerState | null = null;
	#trueForceMount = $derived.by(() => {
		return this.#forceMount.current || this.#group?.forceMount.current === true;
	});
	trueValue = $state("");
	shouldRender = $derived.by(() => {
		if (
			this.#trueForceMount ||
			this.root.shouldFilter.current === false ||
			!this.root.commandState.search
		) {
			return true;
		}
		const currentScore = this.root.commandState.filtered.items.get(this.id.current);
		if (currentScore === undefined) return false;
		return currentScore > 0;
	});

	isSelected = $derived.by(() => this.root.valueProp.current === this.trueValue);

	constructor(props: CommandItemStateProps, root: CommandRootState) {
		this.#ref = props.ref;
		this.id = props.id;
		this.root = root;
		this.#value = props.value;
		this.#disabled = props.disabled;
		this.#onSelectProp = props.onSelect;
		this.#forceMount = props.forceMount;
		this.#group = getCommandGroupContainerContext(null);
		this.trueValue = props.value.current;

		useRefById({
			id: this.id,
			ref: this.#ref,
			condition: () => Boolean(this.root.commandState.search),
		});

		$effect(() => {
			this.id.current;
			this.#group?.id.current;
			if (!this.#forceMount.current) {
				untrack(() => {
					return this.root.registerItem(this.id.current, this.#group?.id.current);
				});
			}
		});

		$effect(() => {
			const value = this.#value.current;
			const node = this.#ref.current;
			if (!node) return;
			if (!value && node.textContent) {
				this.trueValue = node.textContent.trim();
			}

			untrack(() => {
				this.root.registerValue(
					this.id.current,
					this.trueValue,
					props.keywords.current.map((keyword) => keyword.trim())
				);
				node.setAttribute(VALUE_ATTR, this.trueValue);
			});
		});
	}

	#onSelect = () => {
		if (this.#disabled.current) return;
		this.#select();
		this.#onSelectProp?.current();
	};

	#select = () => {
		if (this.#disabled.current) return;
		this.root.setValue(this.trueValue, true);
	};

	#onpointermove = () => {
		if (this.#disabled.current) return;
		this.#select();
	};

	#onclick = () => {
		if (this.#disabled.current) return;
		this.#onSelect();
	};

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"aria-disabled": getAriaDisabled(this.#disabled.current),
				"aria-selected": getAriaSelected(this.isSelected),
				"data-disabled": getDataDisabled(this.#disabled.current),
				"data-selected": getDataSelected(this.isSelected),
				[ITEM_ATTR]: "",
				role: "option",
				onclick: this.#onclick,
				onpointermove: this.#onpointermove,
			}) as const
	);
}

type CommandLoadingStateProps = WithRefProps<
	ReadableBoxedValues<{
		progress: number;
	}>
>;

class CommandLoadingState {
	#ref: CommandLoadingStateProps["ref"];
	#id: CommandLoadingStateProps["id"];
	#progress: CommandLoadingStateProps["progress"];

	constructor(props: CommandLoadingStateProps) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#progress = props.progress;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "progressbar",
				"aria-valuenow": this.#progress.current,
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-label": "Loading...",
				[LOADING_ATTR]: "",
			}) as const
	);
}

type CommandSeparatorStateProps = WithRefProps &
	ReadableBoxedValues<{
		forceMount: boolean;
	}>;

class CommandSeparatorState {
	#ref: CommandSeparatorStateProps["ref"];
	#id: CommandSeparatorStateProps["id"];
	#root: CommandRootState;
	#forceMount: CommandSeparatorStateProps["forceMount"];
	shouldRender = $derived.by(() => !this.#root.commandState.search || this.#forceMount.current);

	constructor(props: CommandSeparatorStateProps, root: CommandRootState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#root = root;
		this.#forceMount = props.forceMount;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			condition: () => this.shouldRender,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "separator",
				[SEPARATOR_ATTR]: "",
			}) as const
	);
}

type CommandListStateProps = WithRefProps &
	ReadableBoxedValues<{
		ariaLabel: string;
	}>;

class CommandListState {
	ref: CommandListStateProps["ref"];
	#id: CommandListStateProps["id"];
	#ariaLabel: CommandListStateProps["ariaLabel"];
	root: CommandRootState;

	constructor(props: CommandListStateProps, root: CommandRootState) {
		this.ref = props.ref;
		this.#id = props.id;
		this.root = root;
		this.#ariaLabel = props.ariaLabel;

		useRefById({
			id: this.#id,
			ref: this.ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "listbox",
				"aria-label": this.#ariaLabel.current,
				[LIST_ATTR]: "",
			}) as const
	);

	createListViewport(props: CommandListViewportStateProps) {
		return new CommandListViewportState(props, this);
	}
}

type CommandLabelStateProps = WithRefProps<ReadableBoxedValues<{ for?: string }>>;

class CommandLabelState {
	#ref: CommandLabelStateProps["ref"];
	#id: CommandLabelStateProps["id"];
	#root: CommandRootState;
	#for: CommandLabelStateProps["for"];

	constructor(props: CommandLabelStateProps, root: CommandRootState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#root = root;
		this.#for = props.for;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#root.labelNode = node;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[INPUT_LABEL_ATTR]: "",
				for: this.#for?.current,
			}) as const
	);
}

type CommandListViewportStateProps = WithRefProps;

class CommandListViewportState {
	#ref: CommandListViewportStateProps["ref"];
	#id: CommandListViewportStateProps["id"];
	#list: CommandListState;

	constructor(props: CommandListViewportStateProps, list: CommandListState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#list = list;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#list.root.listViewportNode = node;
			},
		});

		$effect(() => {
			const node = this.#ref.current;
			const listNode = this.#list.ref.current;
			if (!node || !listNode) return;
			let aF: number;

			const observer = new ResizeObserver(() => {
				aF = requestAnimationFrame(() => {
					const height = node.offsetHeight;
					listNode.style.setProperty(
						"--bits-command-list-height",
						`${height.toFixed(1)}px`
					);
				});
			});

			observer.observe(node);

			return () => {
				cancelAnimationFrame(aF);
				observer.unobserve(node);
			};
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[LIST_VIEWPORT_ATTR]: "",
			}) as const
	);
}

export function useCommandRoot(props: CommandRootStateProps) {
	return setCommandRootContext(new CommandRootState(props));
}

export function useCommandEmpty(props: CommandEmptyStateProps) {
	return getCommandRootContext().createEmpty(props);
}

export function useCommandItem(props: CommandItemStateProps) {
	return getCommandRootContext().createItem(props);
}

export function useCommandGroupContainer(props: CommandGroupContainerStateProps) {
	return setCommandGroupContainerContext(getCommandRootContext().createGroupContainer(props));
}

export function useCommandGroupHeading(props: CommandGroupHeadingStateProps) {
	return getCommandGroupContainerContext().createGroupHeading(props);
}

export function useCommandGroupItems(props: CommandGroupItemsStateProps) {
	return getCommandGroupContainerContext().createGroupItems(props);
}

export function useCommandInput(props: CommandInputStateProps) {
	return getCommandRootContext().createInput(props);
}

export function useCommandLoading(props: CommandLoadingStateProps) {
	return new CommandLoadingState(props);
}

export function useCommandSeparator(props: CommandSeparatorStateProps) {
	return getCommandRootContext().createSeparator(props);
}

export function useCommandList(props: CommandListStateProps) {
	return setCommandListContext(getCommandRootContext().createList(props));
}

export function useCommandListViewport(props: CommandListViewportStateProps) {
	return getCommandListContext().createListViewport(props);
}

export function useCommandLabel(props: CommandLabelStateProps) {
	return getCommandRootContext().createLabel(props);
}
