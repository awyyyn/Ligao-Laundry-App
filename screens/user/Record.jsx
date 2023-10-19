import { Dimensions, ScrollView, StyleSheet, View, Image } from 'react-native'
import { ActivityIndicator, Text,  } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import userStyles from '../styles/user-styles';
import { supabase } from '../../supabaseConfig';
import { useSelector } from 'react-redux'; 
import { RefreshControl } from 'react-native-gesture-handler';

export default function Record() { 
  const { session, user, messages } = useSelector(state => state.user)
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState()
  const navigation = useNavigation(); 

  const getStatusData = async (data) => {
    setLoading(true)
    const res = await supabase.from('laundries_table').select().match({user_id: session, status: ''}) 
    setData(res.data);
    setLoading(false)
  }
  useEffect(() => {

    getStatusData() 

  }, []);

  console.log(typeof data)


  if(loading) return <View style={{height: '100%', display: 'flex', justifyContent: 'center'}}>
    <ActivityIndicator color='#00667E' animating  size={'large'} />
  </View>

  return (
    <ScrollView 
      refreshControl={<RefreshControl refreshing={refresh} onRefresh={getStatusData} />}
      style={{paddingVertical: 10, marginHorizontal: 20, marginBottom: 1}}>
      {
        data.length < 1 ? <>
          <View style={{width: '100%', alignItems: 'center', marginTop: '30%'}}>
            <Image 
              source={{uri: "https://cdni.iconscout.com/illustration/premium/thumb/no-data-found-8867280-7265556.png"}} 
              style={{
                width: '100%', 
                height: 300
              }} 
            />
            <Image />
            <Text style={{fontSize: 23, color: '#00667E88'}}>No Records Found</Text>
          </View>
        </> :
        data.map((data, i) => (
        <View key={i} style={[userStyles.row, styles.record]}>
          <View style={[styles.leftRecord, {rowGap: 2}]}>
            <Text style={styles.recordTitle}>{data.service_type}</Text>
            <View style={[userStyles.row, {justifyContent: 'space-between'}]}>
              <View style={[userStyles.row, {columnGap: 10}]}>
                <Text>Php {data.price}</Text>
                <Text>{data.kg}kg</Text>  
              </View>
              <Text style={{}}>{data.date}</Text>
            </View>
          </View> 
        </View>
        ))
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  record: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 10,    
    borderColor: '#00667E',
    borderWidth: 2, 
  },
  leftRecord: {
    width: '75%'
  },
  rightRecord: {
    width: '25%',
  },
  recordTitle: {
    fontWeight: 'bold',
    fontSize: 20
  }
});