import {React, useState, useEffect} from "react";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


const Dashboard = () => {
    const [numberOfAssetsByBrand, setNumberOfAssetsByBrand] = useState([])
    const [numberOfAssetsByStatus, setNumberOfAssetsByStatus] = useState([])
    const getAllAssets = async () => {
        const resp = await fetch ('http://localhost:5000/')
        const assets = await resp.json()
        console.log(assets)
        const byBrand = Object.entries(assets.reduce((acc, asset) => {
            const brand = asset.brand.toLowerCase();
            acc[brand] = (acc[brand] || 0) + 1;
            return acc;
          }, {})).map(([name, y]) => ({ name, y }))
          
          const byStatus = Object.entries(assets.reduce((acc, asset) => {
            const status = asset.status.toLowerCase();
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {})).map(([name, y]) => ({ name, y }))

        setNumberOfAssetsByBrand(byBrand)
        setNumberOfAssetsByStatus(byStatus)
      }
    const optionsForBrand = {
    chart: {
        type: 'column'
    },
    title: {
        align: 'left',
        text: 'Number of assets by brand:'
    },
    accessibility: {
        announceNewData: {
            enabled: true
        }
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        title: {
            text: 'Number of Assets'
        }
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                format: '{point.y}'
            }
        }
    },

    tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
    },

    series: [
        {
            name: 'Brand',
            colorByPoint: true,
            data: numberOfAssetsByBrand
        }
    ]
}

const optionsForStatus = {
    chart: {
        type: 'column'
    },
    title: {
        align: 'left',
        text: 'Number of assets by status:'
    },
    accessibility: {
        announceNewData: {
            enabled: true
        }
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        title: {
            text: 'Number of Assets'
        }
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                format: '{point.y}'
            }
        }
    },

    tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
    },

    series: [
        {
            name: 'Status',
            colorByPoint: true,
            data: numberOfAssetsByStatus
        }
    ]
}
useEffect(() => {
    getAllAssets()
  }, [])
    return (
        <div>
           <HighchartsReact highcharts={Highcharts} options={optionsForBrand}/> 
           <HighchartsReact highcharts={Highcharts} options={optionsForStatus}/> 
        </div>
        
    )
}

export default Dashboard