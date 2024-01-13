import React from "react";

interface SidebarProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function SideBar<T>({ items, renderItem }: SidebarProps<T>) {
  return (
    <div className="border border-primary">
      <ul>
        {items.map((item, index) => (
          <li key={index}>{renderItem(item)}</li>
        ))}
      </ul>
    </div>
  );
}

export { SideBar };
