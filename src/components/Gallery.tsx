"use client";

type GalleryProps<T> = {
  items: Array<T>;
};

const Gallery = ( { items } : GalleryProps<any> ) => {
  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  );
}