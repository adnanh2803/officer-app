
import { Pagination, Form } from "react-bootstrap";

import './CoreTable.scss'

function PaginationCore({ gotoPage, canNextPage, canPreviousPage, nextPage, previousPage, setPageSize, pageSize, pageOptions, pageIndex }) {

    return (
        <div className="items-per-pages">
            <Pagination size="sm">
                <Pagination.Prev onClick={() => previousPage()} disabled={!canPreviousPage} />
                {pageOptions.length > 0 && pageOptions.map((i) => {
                    return <Pagination.Item key={i} onClick={() => gotoPage(i)} active={pageIndex == i}>{i + 1}</Pagination.Item>
                })|| <Pagination.Item>1</Pagination.Item>} 
                <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} />
            </Pagination >
            <div className="show-group">
                <p>Show</p>
                <Form.Select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                    }}
                >
                    {[5, 10, 15, 20].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize} pages
                        </option>
                    ))}
                </Form.Select>
            </div>
        </div>
    )
}

export default PaginationCore