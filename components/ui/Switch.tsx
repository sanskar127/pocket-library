import React, { useState, useRef, useEffect } from 'react';
import { TouchableWithoutFeedback, Animated } from 'react-native';

interface SwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ value, onValueChange, disabled = false }) => {
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
    if (disabled) return;
    setSwitchValue(prev => !prev);
    onValueChange(!switchValue);
  };

  const trackColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [disabled ? '#181818' : '#00000000', disabled ? '#b0b0b0' : '#ffffff'],
  });

  const thumbColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [disabled ? '#2b2b2b' : '#ffffff', disabled ? '#808080' : '#000000'],
  });

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 16],
  });

  return (
    <TouchableWithoutFeedback onPress={toggleSwitch} disabled={disabled}>
      <Animated.View
        className={`w-11 h-7 border ${disabled ? 'border-[#181818]' : 'border-white'} rounded-full justify-center p-0.5`}
        style={{ backgroundColor: trackColor } as unknown as any} // ← cast fixes TypeScript error
      >
        <Animated.View
          className="w-4 h-4 rounded-full"
          style={{
            backgroundColor: thumbColor,
            transform: [{ translateX }],
          } as unknown as any} // ← cast fixes TypeScript error
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default Switch;
