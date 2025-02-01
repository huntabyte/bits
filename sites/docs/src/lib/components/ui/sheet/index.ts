import { Dialog as SheetPrimitive } from "bits-ui";
import Content from "./sheet-content.svelte";
import Description from "./sheet-description.svelte";
import Footer from "./sheet-footer.svelte";
import Header from "./sheet-header.svelte";
import Overlay from "./sheet-overlay.svelte";
import Title from "./sheet-title.svelte";

const Root = SheetPrimitive.Root as typeof SheetPrimitive.Root;
const Close = SheetPrimitive.Close as typeof SheetPrimitive.Close;
const Trigger = SheetPrimitive.Trigger as typeof SheetPrimitive.Trigger;
const Portal = SheetPrimitive.Portal as typeof SheetPrimitive.Portal;

export {
	Close,
	Content,
	Description,
	Footer,
	Header,
	Overlay,
	Portal,
	Root,
	//
	Root as Sheet,
	Close as SheetClose,
	Content as SheetContent,
	Description as SheetDescription,
	Footer as SheetFooter,
	Header as SheetHeader,
	Overlay as SheetOverlay,
	Portal as SheetPortal,
	Title as SheetTitle,
	Trigger as SheetTrigger,
	Title,
	Trigger,
};
