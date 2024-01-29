import './App.css';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button } from 'react-bootstrap'

const App = () => {
  const gridRef = useRef()
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState([])
  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState([
    { field: "id" },
    { field: "brand" ,
    editable: true
  },
    { field: "serialNumber",
    editable: true }
    ,
    { field: "warrantyExpirationDate",
    editable: true,
   },
    { field: "status",
    editable: true,
    cellEditor: 'agSelectCellEditor', 
    cellEditorParams: {
        values: ["New", "In Use", "Damaged", "Dispose"], 
    }
   },
    { field: "createdDate"}
  ])
  const getAllAssets = async () => {
    const resp = await fetch ('http://localhost:5000/')
    const data = await resp.json()
    console.log(data)
    setRowData(data)
  }

  const addAsset = async (props) => {
    const resp = await fetch ('http://localhost:5000/add', {
      method: 'POST',
      body: JSON.stringify({
        brand: props.brand,
        serialNumber: props.serialNumber,
        warrantyExpirationDate: props.warrantyExpirationDate,
        status: props.status,
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
       }
      })
    })
    const data = await resp.json()
    console.log(data)
    getAllAssets()
  }

  const editAsset = async (props) => {
    const resp = await fetch ('http://localhost:5000/edit', {
      method: 'POST',
      body: JSON.stringify({
        id: props.id,
        brand: props.brand,
        serialNumber: props.serialNumber,
        warrantyExpirationDate: props.warrantyExpirationDate,
        status: props.status,
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
       }
      })
    })
    const data = await resp.json()
    console.log(data)
    getAllAssets()
  }

  const deleteAsset = async (props) => {
    const resp = await fetch ('http://localhost:5000/delete', {
      method: 'POST',
      body: JSON.stringify({
        id: props.id,
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
       }
      })
    })
    const data = await resp.json()
    console.log(data)
    getAllAssets()
  }
  useEffect(() => {
    getAllAssets()
  }, [])

  const onAddRowClicked = useCallback(() => {
    gridRef.current.api.applyTransaction({add: [{}]})
  }, []);

  const onSaveRowClicked = useCallback (() => {
    const selectedRow = gridRef.current.api.getSelectedRows()
    addAsset(selectedRow[0])
  })

  const onEditRowClicked = useCallback (() => {
    const selectedRow = gridRef.current.api.getSelectedRows()
    editAsset(selectedRow[0])
  })

  const onDeleteRowClicked = useCallback (() => {
    const selectedRow = gridRef.current.api.getSelectedRows()
    deleteAsset(selectedRow[0])
  })
  
  
  return (
    <div>
    
      <div className="ag-theme-quartz" style={{ height: 400 }}>
  
    <Button 
    variant='outline-primary'
    style={{
      margin: 8,
      marginTop: 24
    }}
    onClick={ onAddRowClicked }
    >Add Row</Button>
    <Button variant='outline-primary'
    style={{
      margin: 8,
      marginTop: 24
    }}
    onClick={ onSaveRowClicked }
    >Save Row</Button>
    <Button variant='outline-primary'
    style={{
      margin: 8,
      marginTop: 24
    }}
    onClick={ onEditRowClicked }
    >Edit Row</Button>
    <Button variant='outline-danger'
    style={{
      margin: 8,
      marginTop: 24
    }}
    onClick={ onDeleteRowClicked }
    >Delete Row</Button>
    <AgGridReact 
    ref={gridRef}
    rowData={rowData} 
    columnDefs={colDefs}
    rowSelection='single'
    components={components}
    reactiveCustomComponents
     />
  </div>
    </div>
    
  );
}

export default App;
