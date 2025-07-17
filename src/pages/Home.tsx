import { useLocation } from "react-router-dom";
import Directory from "../components/common/Directory";
import Video from "../components/common/Video";
import { useItems } from "../context/itemsContext";
import { useEffect } from "react";
import type { DirectoryInterface, VideoInterface } from "../types/types";

const Home = () => {
  const { items, setItems } = useItems()
  const location = useLocation()


  useEffect(() => {
    fetch(`/api/videos/${location.pathname}`)
      .then(res => res.json())
      .then(setItems)
      .catch(err => console.error('Error fetching videos:', err));
  }, [location.pathname, setItems]);

  return (
    <div className="w-full min-h-screen bg-dark text-foreground container mx-auto px-4 py-6">
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.map(item => {
          if (item.type === 'directory')
            return <Directory key={item.id} details={item as DirectoryInterface} />
          else
            return <Video key={item.id} details={item as VideoInterface} />
        })}
      </div>
    </div>
  );
};

export default Home;
