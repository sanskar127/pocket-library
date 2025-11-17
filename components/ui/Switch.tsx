import React, { useState, useRef, useEffect } from 'react';
import { TouchableWithoutFeedback, Animated } from 'react-native';

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ value, onValueChange }) => {
  const [switchValue, setSwitchValue] = useState<boolean>(value);
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: switchValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [switchValue, animation]);

  const toggleSwitch = () => {
    setSwitchValue(prev => !prev);
    onValueChange(!switchValue);
  };

  const trackColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000000', '#ffffff'], // grayscale track
  });

  const thumbColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', '#000000'], // grayscale thumb
  });

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 14], // adjusted thumb slide distance
  });

  return (
    <TouchableWithoutFeedback onPress={toggleSwitch}>
      <Animated.View
        className="w-11 h-7 border border-white rounded-full justify-center p-0.5" // increased size by ~18%
        style={{ backgroundColor: trackColor }}
      >
        <Animated.View
          className="w-5 h-5 rounded-full" // slightly bigger thumb
          style={{ backgroundColor: thumbColor, transform: [{ translateX }] }}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default CustomSwitch;
