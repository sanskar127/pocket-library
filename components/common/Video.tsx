import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import type { FC } from 'react';
import type { VideoInterface } from '@/types/types';
import { formatTime, formatSize, formatRelativeTime } from '@/utils/utils';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

const VideoCard: FC<{ details: VideoInterface }> = ({ details }) => {
  const { id, thumbnail, name, duration, modifiedAt, size, type } = details;
  const baseUrl = useSelector((state: RootState) => state.response.baseURL)
  const router = useRouter()

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.videoWrapper} onPress={() => router.push(`/watch/${id}`)}>
        {thumbnail ? (
          <Image
            source={{ uri: baseUrl + thumbnail }}
            resizeMode="contain"
            style={styles.thumbnail}
          />
        ) : (
          <View
            className="w-full aspect-[16/9] items-center justify-center bg-primary"
          >
            <Ionicons name="videocam" size={96} color="currentColor" />
          </View>
        )}

        <View style={styles.timestampTop}>
          <Text style={styles.timestampText}>{formatRelativeTime(modifiedAt)}</Text>
        </View>
        <View style={styles.timestampBottom}>
          <Text style={styles.timestampText}>{formatTime(duration)}</Text>
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
  videoWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
  },
  thumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#007bff',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 8,
  },
  timestampTop: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  timestampBottom: {
    position: 'absolute',
    bottom: 4,
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

export default VideoCard;
