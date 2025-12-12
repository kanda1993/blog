import { AboutCard } from "./AboutCard";
import { CategoryList } from "./CategoryList";
import { TagList } from "./TagList";

interface SidebarProps {
  showIds?: boolean;
}

export function Sidebar({ showIds = false }: SidebarProps) {
  return (
    <aside className="space-y-4">
      <div id={showIds ? "about" : undefined} className="scroll-mt-20">
        <AboutCard />
      </div>
      <div id={showIds ? "categories" : undefined} className="scroll-mt-20">
        <CategoryList />
      </div>
      <div id={showIds ? "tags" : undefined} className="scroll-mt-20">
        <TagList />
      </div>
    </aside>
  );
}
