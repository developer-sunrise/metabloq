import React from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
  } from "recharts";
import { FormatDate1 } from '../../helpers/API&Helpers';

function SalesHistoryChart(props) {
  let {data} = props;
  const result = data.map((data,i)=>{
    return {
      price:data.activities_price,
      date:FormatDate1(data.activities_updatedat)
    }
  })

  return (
    <>
    <LineChart  
      data={result.reverse()}
      width={500}
      height={230}
      
      margin={{
        top: 5,
        right: 30,
        left: 0,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="5 5" />
      <XAxis dataKey="date" />
      <YAxis dataKey="price"/>
      <Tooltip />
      
      <Line
        type="monotone"
        dataKey="price"
        stroke="#2795e9"
        fill='#2795e9'
        // strokeDasharray="3 4 5 2"
      />
    </LineChart>
    </>
  )
}

export default SalesHistoryChart