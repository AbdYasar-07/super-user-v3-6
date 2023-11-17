import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect } from "react";
import { BiCross, BiPencil, BiSolidTime, BiTime, BiTrash, BiUserPlus } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { renderComponent } from "../store/auth0Slice";

const DataGridTable = ({ data, rowHeader, getCurrentData, loading, action, emptyMessage, showTrashOnly = false, isRowCheck = false }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const alignHeader = (column) => {
    if (!column) return;

    if (column && column.split(" ").length >= 2) {
      column = String(column).replaceAll(" ", "");
      return column;
    }

    return column;
  };

  const handleClickOnName = (rowData) => {
    return (
      <div
        className="text-primary"
        style={{ cursor: "pointer" }}
        onClick={() => getCurrentData(rowData)}
      >
        {rowData[alignHeader(rowHeader[0])]}
      </div>
    );
  };

  const handleActionClick = () => {
    dispatch(renderComponent({ cmpName: "MEMBER" }));
    navigate("/members");
  };

  const handleTrashClick = (rowData) => {
    getCurrentData(rowData, 'remove');
    // console.log("Row Data :::", rowData);
  }

  const handelAction = (rowData) => {
    return (
      <div className="d-flex align-items-center">
        <>
          {!showTrashOnly &&
            <BiUserPlus
              style={{
                fontSize: "24px",
                color: "#363535",
                width: "30px",
                height: "30px",
                padding: "4px",
                borderRadius: "3px",
                cursor: "pointer"
              }}
              title="Add member"
              className="mx-1 fw-light"
              onClick={() => handleActionClick()}
            />
          }
          {!showTrashOnly &&
            <BiPencil
              style={{
                fontSize: "24px",
                color: "#363535",
                width: "30px",
                height: "30px",
                padding: "4px",
                borderRadius: "3px",
                cursor: "pointer"
              }}
              title="Edit BP"
              className="mx-1"
            />
          }
          {showTrashOnly &&
            <i
              style={{
                fontSize: "24px",
                color: "#363535",
                width: "30px",
                height: "30px",
                padding: "4px",
                borderRadius: "3px",
                cursor: "pointer",
                color: 'grey',
                fontSize: '1.5rem'
              }}
              title="Remove Member"
              className="mx-1 pi pi-times"
              onClick={(e) => handleTrashClick(rowData)}
            />
          }
        </>
      </div>
    );
  };
  return (
    <div className="card">
      <DataTable
        value={data}
        removableSort
        filterDisplay="row"
        paginator={data.length >= 10}
        rows={10}
        tableStyle={{ minWidth: "50rem" }}
        emptyMessage={emptyMessage}
        loading={loading}
        onSelectionChange={(e) => {
          console.log("e .target .value ", e.value);
        }}
      >
        {isRowCheck &&
          <Column selectionMode="single" headerStyle={{ width: '3rem' }}>
          </Column>
        }
        {rowHeader?.map((colHeader) => {
          return (
            <Column
              field={alignHeader(colHeader)}
              header={colHeader}
              filter={!(colHeader === "Action")}
              sortable={!(colHeader === "Action")}
              style={{
                width: "fit-content",
              }}
              body={
                action
                  ? colHeader === rowHeader[0]
                    ? handleClickOnName
                    : colHeader === "Action"
                      ? handelAction
                      : ""
                  : colHeader === rowHeader[0] && handleClickOnName
              }
            ></Column>
          );
        })}
      </DataTable>
    </div>
  );
};

export default DataGridTable;
