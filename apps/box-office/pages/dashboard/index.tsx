import React, { useState } from 'react';
import { Down } from '@icon-park/react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import LineChart from '@components/LineChart'
import ApexCharts from 'apexcharts'

const Dashboard = () => {
  const [data, updateData] = useState([1, 2, 3, 4, 5, 6]);
  return (
    <div className="px-3 pt-3">
      <div className="card">
        <div className="font-medium mb-2">Total Revenue</div>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="text-2xl font-bold text-rose-500">36,641.20</div>
            <div className="flex items-center text-gray-500 font-medium mt-1">
              <svg width="16px" height="16px" viewBox="0 0 14 14">
                <path fillRule="evenodd" clipRule="evenodd" fill="currentColor" d="M7,12.333c2.946,0,5.333-2.388,5.333-5.333S9.946,1.667,7,1.667S1.667,4.055,1.667,7S4.055,12.333,7,12.333z M7,13.667c3.682,0,6.667-2.985,6.667-6.667c0-3.682-2.985-6.667-6.667-6.667C3.318,0.333,0.333,3.318,0.333,7C0.333,10.682,3.318,13.667,7,13.667z M6.333,3.667C6.333,3.298,6.632,3,7,3c0.368,0,0.667,0.298,0.667,0.667c1.105,0,2,0.895,2,2c0,0.368-0.298,0.667-0.667,0.667S8.333,6.035,8.333,5.667C8.333,5.298,8.035,5,7.667,5H6.162C5.889,5,5.667,5.222,5.667,5.496c0,0.213,0.137,0.403,0.339,0.47l2.411,0.804c0.747,0.249,1.251,0.948,1.251,1.735c0,1.01-0.819,1.829-1.829,1.829H7.667C7.667,10.701,7.368,11,7,11c-0.368,0-0.667-0.299-0.667-0.667c-1.105,0-2-0.895-2-2c0-0.368,0.298-0.667,0.667-0.667c0.368,0,0.667,0.298,0.667,0.667C5.667,8.702,5.965,9,6.333,9h1.504c0.274,0,0.496-0.222,0.496-0.496c0-0.213-0.137-0.403-0.339-0.47L5.584,7.231C4.837,6.982,4.333,6.283,4.333,5.496c0-1.01,0.819-1.829,1.829-1.829H6.333z"/>
              </svg>
              <span className="ml-1 text-sm">36,641.20 CAD</span>
            </div>
          </div>
          <div className="p-1">
            <div className="expend">
              <Down theme="outline" size="14" fill="currentColor" strokeWidth={6}/>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-6">
          <div className="flex-1">
            <div className="text-gray-700 text-sm mb-1">Total tickets sold</div>
            <div className="text-teal-500 mb-3 font-medium">520,999</div>
            <div className="text-gray-700 text-sm mb-1">Total avaible tickets</div>
            <div className="font-medium">1000,896</div>
          </div>
          <div className="w-24 h-24">
            <CircularProgressbar
              value={45}
              text={`${45}%`}
              strokeWidth={6}
              styles={buildStyles({
                pathColor: '#00A699',
                trailColor: '#000',
              })}
            />
          </div>
        </div>
        <div className="flex justify-center mt-3">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-teal-500" />
            <div className="text-gray-500 ml-2 text-sm">sold</div>
          </div>
          <div className="flex items-center ml-4">
            <div className="w-2 h-2 rounded-full bg-black" />
            <div className="text-gray-500 ml-2 text-sm">available</div>
          </div>
        </div>
      </div>
      <div className="card mt-3">
        <div className="font-medium mb-2">More trending report/Ticket Sales Overview?</div>
      </div>
      <div className="card mt-3">
        <div className="font-medium mb-2">Total Check In</div>
        <div className="mb-5">
          <span className="text-2xl font-medium text-blue-500">368,999</span>
          <span className="mx-1">/</span><span>10000,000</span>
        </div>
        <div className="text-gray-700 text-sm mb-1">VIP check in</div>
        <div className="mb-3">
          <span>10000,896</span>
          <span className="mx-1">/</span><span className="text-gray-500">3892,999</span>
        </div>
        <div className="text-gray-700 text-sm mb-1">GA check in</div>
        <div>
          <span>10000,896</span>
          <span className="mx-1">/</span><span className="text-gray-500">3892,999</span>
        </div>
        <div className="h-px bg-gray-100 my-5"></div>
        <div className="font-medium mb-2">5 hours range from 4 hours before the show</div>
        {/* <LineChart data={data} /> */}
      </div>
    </div>
  )
}

export default Dashboard
