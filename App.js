import { StatusBar } from "expo-status-bar";
import { StyleSheet,SafeAreaView,Text} from "react-native";
import { colors } from "./src/constants";
import Game from "./src/components/Game/Game";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>WORDY</Text>
      <Game/>
     
    </SafeAreaView>
  );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 7,
  },

});
