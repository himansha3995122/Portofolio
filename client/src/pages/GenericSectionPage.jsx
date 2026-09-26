import { useParams } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import UnderConstruction from "../components/UnderConstruction";
import { useData } from "../context/DataContext";

export default function GenericSectionPage() {
  const { id } = useParams();
  const { navItems } = useData();
  const item = navItems.find((i) => i.id === id);

  return (
    <main className="py-14 pb-12 min-h-[52vh]">
      <SectionHeader tag="Section" title={item ? item.label : "Not found"} />
      <UnderConstruction />
    </main>
  );
}
