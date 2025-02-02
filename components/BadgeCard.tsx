import { View, ViewStyle } from "react-native";

interface CardProps extends React.PropsWithChildren {
  style?: ViewStyle;
}

export default function Card({ children, style = {} }: CardProps) {
  return (
    <View
      style={{
        padding: 10,
        borderRadius: 15,
        backgroundColor: "#FFFEEB",
        elevation: 8,
        shadowColor: "#000",
        shadowRadius: 8,
        shadowOffset: { height: 6, width: 0 },
        shadowOpacity: 0.15,
        width: '94%',
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 5,
        ...style,
      }}
    >
      {children}
    </View>
  );
}