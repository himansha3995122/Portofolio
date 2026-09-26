import { useParams } from "react-router-dom";
import VisualsPage from "./VisualsPage";
import ProjectsPage from "./ProjectsPage";
import BooksPage from "./BooksPage";
import LeetcodePage from "./LeetcodePage";
import GenericSectionPage from "./GenericSectionPage";

// Nav items are admin-editable and can have any id, but these four ids
// are wired to real pages. Anything else falls back to the generic
// "under construction" page.
const SPECIAL_PAGES = {
  visuals: VisualsPage,
  swe: ProjectsPage,
  books: BooksPage,
  leetcode: LeetcodePage,
};

export default function SectionRouter() {
  const { id } = useParams();
  const Page = SPECIAL_PAGES[id] || GenericSectionPage;
  return <Page />;
}
