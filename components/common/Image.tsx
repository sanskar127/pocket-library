import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import type { FC } from 'react';
import type { ImageInterface } from '@/types/types';
import { formatSize, formatRelativeTime } from '@/utils/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

const ImageCard: FC<{ details: ImageInterface }> = ({ details }) => {
  const { id, name, modifiedAt, size, type, url } = details;
  const baseUrl = useSelector((state: RootState) => state.response.baseURL)
  const router = useRouter()

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageWrapper} onPress={() => router.push(`/view/${id}`)}>
        <Image
          source={{ uri: baseUrl + url }}
          resizeMode="contain"
          style={styles.image}
        />
        <View style={styles.timestamp}>
          <Text style={styles.timestampText}>{formatRelativeTime(modifiedAt)}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.meta}>
          {formatSize(size)} • {type}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: screenWidth * 0.95,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  timestamp: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  timestampText: {
    color: '#fff',
    fontSize: 10,
  },
  infoContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  meta: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default ImageCard;
