import { forwardRef, useState, useRef, useEffect, useContext } from "react";
import { useTable, useRowSelect, usePagination } from "react-table";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Nav } from "react-bootstrap";
import BTable from 'react-bootstrap/Table'
import './CoreTable.scss'
import PaginationCore from "./PaginationCore";
import CoreTableTools from "./CoreTableTools";
import CoreModal from "../Modal/CoreModal";
import { UserContext } from "../../../hooks/Auth/UserContext";

function CoreTable({objectName,hasCheckbox = true, setSelRows,selRows, actionBar, setData, data, columns, title, createFormConf, createFunc, apiService }) {
    
    const IndeterminateCheckbox = forwardRef(
        ({ indeterminate, ...rest }, ref) => {
            const defaultRef = useRef();
            const resolvedRef = ref || defaultRef;

            useEffect(() => {
                resolvedRef.current.indeterminate = indeterminate;
            }, [resolvedRef, indeterminate]);

            return (
                <>
                    <input type="checkbox" ref={resolvedRef} {...rest} />
                </>
            );
        }
    );
    const [initSelectedRows, setInitSelectedRows] = useState({});
    const {hasActionPrivilagesForObject} = useContext(UserContext);
    //Set preselected rows
    useEffect(()=>{
        if(!hasCheckbox || !selRows) return
        const initArr = selRows.map((row)=>{
            return [row.id, true]
        })
        setInitSelectedRows(Object.fromEntries(initArr))
    },[])
    //Initial value could be used to preselect row ie. id:1 would select first row
    const [selectedRow, setSelectedRow] = useState({ id: -1 })

    const {
        getTableProps,
        headerGroups,
        page,
        prepareRow,
        selectedFlatRows,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { selectedRowIds, pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: {
                 pageIndex: 0,
                 pageSize: 5,
                 selectedRowIds: initSelectedRows
            },
        },
        usePagination,
        useRowSelect,
        (hooks) => {
            hasCheckbox && hooks.visibleColumns.push((columns) => [
                // Let's make a column for selection
                {
                    id: "selection",
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <div>
                            <IndeterminateCheckbox
                                {...getToggleAllRowsSelectedProps()}
                            />
                        </div>
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => (
                        <div>
                            <IndeterminateCheckbox
                                {...row.getToggleRowSelectedProps()}
                            />
                        </div>
                    ),
                },
                ...columns,
            ]);
        }
    );
    const [show, setShow] = useState(false);
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const [isInEdit, setIsInEdit] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(()=>{

    })

    useEffect(()=>{
        if(hasCheckbox){
            if(setSelRows) setSelRows(selectedFlatRows)
        }else{
            if (setSelRows && selectedRow.id != -1) setSelRows(selectedRow)
        }
    },[selectedFlatRows,selectedRow])

    const handleClose = (dataChanged) => {
        typeof (dataChanged) == 'boolean' && dataChanged && setData(null)
        setShow(false)
    };

    const handleShow = (edit, row = null) => {
        setIsInEdit(edit);
        setShow(true);
    };
    const handleShowDeleteWarning = () => {
        setShowDeleteWarning(true)
    };

    const handleCloseDeleteWarning = () =>{
        setShowDeleteWarning(false)
    }

    const removeData = async () => {
        setIsDeleting(true)
        let ids = selectedFlatRows.map((row) => {
            return row.original._id
        })
        await apiService.remove(ids)
        setIsDeleting(false)
        setData(null)
    }
    return (
        <div className="CoreTable">
            <CoreModal handleClose={handleClose} modalProp={createFormConf} isInEdit={false} show={show} apiService={apiService} title={title}></CoreModal>
            <div className="table-title">
                <h3>{title}</h3>
            </div>
            {actionBar && <CoreTableTools crudPrivilages={hasActionPrivilagesForObject(objectName)} create={handleShow} remove={handleShowDeleteWarning}></CoreTableTools>}
            <div className="table-wrap">
                <BTable hover size="sm" {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>
                                        {column.render("Header")}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {page.length > 0 && page.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr className={selectedRow.id == row.id ? 'selected-row' : ''}
                                    {...row.getRowProps()}
                                    onClick={() => {
                                        setSelectedRow(row)
                                    }}
                                >
                                    {row.cells.map((cell) => {
                                        return (
                                            <td {...cell.getCellProps()}>
                                                {cell.render("Cell")}
                                            </td>
                                        );
                                    })}
                                </tr>
                            )
                        }) || <tr><td colSpan="100%">No data</td></tr>}
                    </tbody>
                </BTable>
            </div>
            <PaginationCore gotoPage={gotoPage} canNextPage={canNextPage} canPreviousPage={canPreviousPage} nextPage={nextPage} previousPage={previousPage} setPageSize={setPageSize} pageSize={pageSize} pageOptions={pageOptions} pageIndex={pageIndex} />
            <Modal show={showDeleteWarning} onHide={handleCloseDeleteWarning} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Remove {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        {'You are about to remove ' + selectedFlatRows.length + ' ' + title}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        disabled={isDeleting}
                        variant="secondary"
                        onClick={handleCloseDeleteWarning}
                    >
                        Close
                    </Button>
                    <Button
                        form="group-form"
                        type="button"
                        variant="primary"
                        disabled={isDeleting}
                        onClick={()=> removeData()}
                    >
                    Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
CoreTable.defaultProps = {
    actionBar: true
}
export default CoreTable;
