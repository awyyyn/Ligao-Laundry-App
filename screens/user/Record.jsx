import { Dimensions, ScrollView, StyleSheet, View } from 'react-native'
import { ActivityIndicator, Text } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import userStyles from '../styles/user-styles';
import { supabase } from '../../supabaseConfig';
import { useSelector } from 'react-redux';

export default function Record() { 
  const { session, user, messages } = useSelector(state => state.user)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState()
  const navigation = useNavigation(); 

  useEffect(() => {
    const getStatusData = async (data) => {
      setLoading(true)
      const res = await supabase.from('laundries_table').select().match({user_id: session, status: 'done'}) 
      setData(res.data);
      setLoading(false)
    }

    getStatusData() 

  }, []);

  console.log(typeof data)


  if(loading) return <View style={{height: '100%', display: 'flex', justifyContent: 'center'}}>
    <ActivityIndicator color='#00667E' animating  size={'large'} />
  </View>

  return (
    <ScrollView style={{paddingVertical: 10, marginHorizontal: 20, marginBottom: 10}}>
      {
        data && data.map((data, i) => (
        <View key={i} style={[userStyles.row, styles.record]}>
          <View style={[styles.leftRecord, {rowGap: 2}]}>
            <Text style={styles.recordTitle}>{data.service_type}</Text>
            <View style={[userStyles.row, {justifyContent: 'space-between'}]}>
              <View style={[userStyles.row, {columnGap: 10}]}>
                <Text>$ {data.price}</Text>
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