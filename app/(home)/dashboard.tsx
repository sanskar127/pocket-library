import { DirectoryInterface, ImageInterface, RenderItemInterface, VideoInterface } from '@/types/types';
import Directory from '@/components/common/Directory';
import Image from '@/components/common/Image';
import Video from '@/components/common/Video';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import ItemListing from '@/components/ui/ItemListing';

export default function Dashboard() {
  const data = useSelector((state: RootState) => state.response.data)

  const renderItem: RenderItemInterface = ({ item }) => {
    if (item.type === 'directory') return <Directory details={item as DirectoryInterface} />
    if (item.type.startsWith('image/')) return <Image details={item as ImageInterface} />
    if (item.type.startsWith('video/')) return <Video details={item as VideoInterface} />
    return null;
  };

  return <ItemListing data={data} renderItem={renderItem} />
}
