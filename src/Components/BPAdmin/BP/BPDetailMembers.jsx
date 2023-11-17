import { SelectButton } from "primereact/selectbutton";
import React, { useEffect, useState } from "react";
import "../../Styles/BPDetailMembers.css";
import Axios from "../../../Utils/Axios";
import axios from "axios";
import { useParams } from "react-router-dom";
import DataGridTable from "../../../Utils/DataGridTable";
import AppSpinner from "../../../Utils/AppSpinner";
import { Button } from "primereact/button";

const BPDetailMembers = () => {
  const resource = process.env.REACT_APP_AUTH_EXT_RESOURCE;
  const { bpId } = useParams();
  const [members, setMembers] = useState([]);
  const [filterRecord, setFilteredRecord] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("InBP");
  const [message, setMessage] = useState(
    "Individually Unassign Users From This BP"
  );
  const [showOutBP, setShowOutBP] = useState(false);
  const items = [
    { name: "Members in this BP", value: "InBP" },
    { name: "All Unassigned Members", value: "OutBP" },
  ];

  useEffect(() => {
    setLoading(true);
    getMembersForBP(bpId);
  }, []);

  const getMembersForBP = async (bpId) => {
    if (!bpId) return;

    let url = `${resource}/groups/${bpId}/members`;
    const response = await Axios(
      url,
      "GET",
      null,
      localStorage.getItem("auth_access_token"),
      false,
      false,
      false
    );
    if (!axios.isAxiosError(response)) {
      setMembers(response?.users);
      handleUsersMapping(response?.users);
      setLoading(false);
      return response;
    } else {
      console.error(
        "Error while getting members for a group :::",
        response?.cause?.message
      );
      setLoading(false);
      return null;
    }
  };

  const getCurrentData = async (data, action) => {
    switch (action?.toLowerCase()) {
      case "remove": {
        await removeMemberFromCurrentBP(data.id, bpId);
        await getMembersForBP(bpId);
        break;
      }
      default: {
        console.log("No action triggered");
        break;
      }
    }
  };

  const removeMemberFromCurrentBP = async (memberId, bpId) => {
    let url = `${resource}/groups/${bpId}/members`;
    const body = [`${memberId}`];
    const response = await Axios(
      url,
      "DELETE",
      body,
      localStorage.getItem("auth_access_token"),
      false,
      false,
      false
    );
    if (!axios.isAxiosError(response)) {
      setLoading(false);
      return response;
    } else {
      console.error(
        "Error while removing member for a group :::",
        response?.cause?.message
      );
      setLoading(false);
      return null;
    }
  };

  const handleUsersMapping = (users) => {
    if (Array.isArray(users) && users.length > 0) {
      const actualUsers = users.map((user) => {
        return {
          id: user?.user_id,
          Name: user?.name,
          Email: user?.email,
          LatestLogin: formatTimestamp(user?.last_login),
          Logins: user?.logins_count,
          Connection: user?.identities[0]?.connection,
        };
      });
      setFilteredRecord(actualUsers);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) {
      return "Never";
    }
    const date = new Date(timestamp);
    const now = new Date();

    const diffInMilliseconds = Math.abs(now - date);
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const renderOutBP = (tabValue) => {
    if (typeof tabValue === "string" && tabValue === "OutBP") {
      setMessage("Relate Users To This BP");
      setShowOutBP(true);
      return;
    } else {
      setMessage("Individually Unassign Users From This BP");
      setShowOutBP(false);
      return;
    }
  };

  useEffect(() => {
    console.log("renderOutBP", value);
    renderOutBP(value);
  }, [value]);

  return (
    <>
      <div
        className="text-start"
        // style={{ marginTop: "30px", position: "relative", right: "465px" }}
      >
        <div
          className="mt-3"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
          }}
        >
          {/*  mt-3" ; */}
          <SelectButton
            value={value}
            onChange={(e) => setValue(e.value)}
            optionLabel="name"
            options={items}
          />
          {showOutBP && (
            <Button
              style={{
                borderRadius: "7px",
                marginRight: "30px",
              }}
              label="Create Member"
            ></Button>
          )}
        </div>
        <div className="text-center">{loading && <AppSpinner />}</div>
        {!loading && (
          <div>
            <p
              className="pMessage fw-light"
              style={{ color: "rgb(114, 114, 114)" }}
            >
              {message}
            </p>
          </div>
        )}
      </div>
      <div>
        <div style={{ position: "relative", left: "467px !important" }}>
          {!loading && !showOutBP && (
            <DataGridTable
              data={filterRecord}
              rowHeader={[
                "Name",
                "Email",
                "Latest Login",
                "Logins",
                "Connection",
                "Action",
              ]}
              getCurrentData={getCurrentData}
              loading={loading}
              action={true}
              showTrashOnly={true}
              emptyMessage={"No Members Found."}
            />
          )}
          {
            !loading && showOutBP && <p>All Unassigned members goes here...</p>
            // <DataGridTable
            //     data={filterRecord}
            //     rowHeader={[
            //         "Name",
            //         "Email",
            //         "Latest Login",
            //         "Logins",
            //         "Connection",
            //         "Action",
            //     ]}
            //     getCurrentData={getCurrentData}
            //     loading={loading}
            //     action={true}
            //     showTrashOnly={true}
            //     emptyMessage={"No Members Found."}
            // />
          }
        </div>
      </div>
    </>
  );
};

export default BPDetailMembers;
