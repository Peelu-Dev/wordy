import { View, Text, StyleSheet, Pressable,Alert,Share } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors,colorsToEmoji } from '../../constants'
import * as Clipboard from "expo-clipboard";
import AsyncStorage from '@react-native-async-storage/async-storage'
// import Animated, { SlideInLeft } from 'react-native-reanimated';



const Number = ({number,label})=>(
    <View style={{alignItems:"center",margin:10}}>
        <Text style={{color:colors.lightgrey, fontSize:30, fontWeight:'bold'}} >{number}</Text>
        <Text style={{color:colors.lightgrey, fontSize:16 }} >{label}</Text>
    </View>
);

// const GuessStatsLine = ({position,amount,percentage})=>{
//     return(
//         <View style={{flexDirection:'row', alignItems:"center", width:"100%"}} >
//             <Text style={{color:colors.lightgrey}}>{position}</Text>
//             <View style={{ width:`${percentage}%`, backgroundColor:colors.grey, margin:5, padding:5, alignSelf:'stretch',minWidth:20}}>
//                 <Text style={{color:colors.lightgrey}}>{amount}</Text>
//             </View>
//         </View>
//     )
// }

// const GuessStats = ({distribution})=>{
//     if(!distribution){
//         return null;
//     }
//     const  sum = distribution.reduce((total,dist) => dist + total, 0);
    
//     return(
//      <>
//     <Text style={styles.subTitle}>GUESS STATS</Text>
//     <View style={{width:"100%", padding:20}}>
//         {distribution.map((dist,index)=>(
//             <GuessStatsLine key={index}  position={index + 1} amount={dist} percentage={(100*dist) / sum} />
//         ))}
//     </View>
//     </>
//     )
// }


const EndScreen = ({won = false, rows, getCellBGColor}) => {
    const [secondsTillTommorrow,setSecondsTillTommorrow] = useState(0);
    const [played,setPlayed] = useState(0);
    const [winRate,setWinRate] = useState(0);
    const [curStreak,setCurStreak] = useState(0);
    const [maxStreak,setMaxStreak] = useState(0);
    // const [distribution,setDistribution] = useState(null);

    useEffect(()=>{
        readState();
    },[]);

  

    const share = () => {
        const textMap = rows
          .map((row, i) =>
            row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")
          )
          .filter((row) => row)
          .join("\n");
        const textToShare = `Wordy \n${textMap}`;
        Clipboard.setString(textToShare);
        Alert.alert("Copied successfully", "Share your score on you social media");
      };

    

    useEffect(()=>{
        const updateTime = ()=>{
            const now = new Date();
            const tommorrow = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1
            );
            setSecondsTillTommorrow((tommorrow-now)/ 1000)
        };
        const interval = setInterval(updateTime,1000);
        return ()=> clearInterval(interval)

    },[]);

    const readState = async()=>{
        const dataString = await AsyncStorage.getItem("@game");
        let data;
        try{
          data = JSON.parse(dataString);
          console.log(data)
        //   setPlayed(Object.keys(data).length)
        }catch(e){
          console.log("Couldn't parse that state")
        }
        // setLoaded(true)
        const keys = (Object.keys(data))
        const values = Object.values(data);

        setPlayed(keys.length)
        const numberOfWins = values.filter(game => game.gameState === 'won').length;
        setWinRate(Math.floor((100 * numberOfWins)/ keys.length)); 
        
        let _curStreak = 0;
        let maxStreak = 0;
        let prevDay = 0;
        keys.forEach((key)=>{
            const day = parseInt(key.split('-')[1]);
            console.log(day);
            if(data[key].gameState === 'won' && _curStreak === 0){
                _curStreak += 1
            }else if(data[key].gameState === 'won' && prevDay + 1 === day){
                _curStreak += 1
            }
            else{
                if(_curStreak > maxStreak){
                    maxStreak = _curStreak;
                }
                _curStreak = data[key].gameState === 'won'? 1 : 0;
            }
            prevDay = day
        });
        setCurStreak(_curStreak)
        setMaxStreak(maxStreak)

        //Guess Stats

        // const dist = [0,0,0,0,0,0];
        // values.map(game => {
        //     if(game.gameState === 'won'){
        //         const tries = game.rows.filter((row)=> row[0].length)
        //         dist[tries] = dist[tries] + 1
        //     }
        // });
        // setDistribution(dist)
      }

    const formatSeconds = ()=>{
        const hours = Math.floor(secondsTillTommorrow / (60 * 60));
        const minutes = Math.floor(secondsTillTommorrow % (60*60) / 60);
        const seconds = Math.floor(secondsTillTommorrow % 60);
        return `${hours}:${minutes}:${seconds}`
    }
  return (
    <View style={{width:"100%",alignItems:"center"}} >
      <Text style={styles.title}>{won ? "Congratulations,you have  guessed that word" : "Try Again Tommorrow"}</Text>
      {/* <View > */}
      <Text style={styles.subTitle}>STATISTICS</Text>
      <View style={{flexDirection:'row', marginBottom:20}} >
      <Number number={played} label={'Played'} />
      <Number number={winRate} label={'Win %'} />
      <Number number={curStreak} label={'Cur Streak'} />
      <Number number={maxStreak} label={'Max Streak'} />
      </View>
      {/* </View> */}
     
     {/* <GuessStats distribution={distribution}/> */}
    
     < View style={{flexDirection:"row",padding:10}} >
         <View style={{alignItems:"center", flex:1}}>
             <Text style={{color:colors.lightgrey}} >Next Wordy</Text>
             <Text style={{color:colors.lightgrey, fontSize:22, fontWeight:'bold'}} >{formatSeconds()}</Text>
         </View>
         <Pressable style={{flex:1, backgroundColor:colors.primary,borderRadius:25,alignItems:"center",justifyContent:"center"}} onPress={share} >
             <Text style={{color:colors.lightgrey,fontWeight:'bold'}}>Share</Text>
         </Pressable>
     </View>
    </View>
  )
}



const styles = StyleSheet.create({
    title:{
        fontSize:30, 
        color:'white',
        textAlign:"center",
        marginVertical:20
    },
    subTitle:{
        fontSize:25,
        color: colors.lightgrey,
        textAlign:"center",
        marginVertical:15,
        fontWeight: "bold"
    }
})

export default EndScreen