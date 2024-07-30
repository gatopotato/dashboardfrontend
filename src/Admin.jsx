import { useState, useEffect } from "react";

function Admin() {
  const getHeads = (setData) => {
    fetch("/api/v2/head").then(res => res.json()).then(data => { setData(data.data); console.log("Head Options", data.data); })
  }

  const getRMs = (setData, head = "") => {
    fetch("/api/v2/rm/" + head).then(res => res.json()).then(data => { setData(data.data); console.log("RM Options", data.data); })
  }

  const getAgents = (setData, rm = "", head = "") => {
    if (rm) {
      fetch("/api/v2/agent/rm/" + rm).then(res => res.json()).then(data => { setData(data.data); console.log("Agent Options", data.data); })
    }
    else if (head) {
      fetch("/api/v2/agent/head/" + head).then(res => res.json()).then(data => { setData(data.data); console.log("Agent", data.data); })
    }
    else {
      fetch("/api/v2/agent").then(res => res.json()).then(data => { setData(data.data); console.log("Agent", data.data); })
    }
  }
  const getPolicy = (setData, head = "", rm = "", agent = "") => {
    if (agent) {
      fetch("/api/v2/policy/agent/" + agent).then(res => res.json()).then(data => { setData(data.data); console.log("Policies", data.data); })
    } else if (rm) {
      fetch("/api/v2/policy/rm/" + rm).then(res => res.json()).then(data => { setData(data.data); console.log("Policies", data.data); })
    } else if (head) {
      fetch("/api/v2/policy/head/" + head).then(res => res.json()).then(data => { setData(data.data); console.log("Policies", data.data); })
    } else {
      fetch("/api/v2/policy/").then(res => res.json()).then(data => { setData(data.data); console.log("Policies", data.data); })
    }
  }



  const [headOptions, setHeadOptions] = useState([]);
  const [rmOptions, setrmOptions] = useState([]);
  const [agentOptions, setagentOptions] = useState([]);
  const [rm, setrm] = useState("");
  const [agent, setagent] = useState("");
  const [head, sethead] = useState("");
  const [policies, setPolicies] = useState([]);
  const [policyexist, setPolicyExist] = useState(false);
  useEffect(() => {
    getHeads(setHeadOptions);
    getRMs(setrmOptions, head);
    getAgents(setagentOptions, rm, head);
  }, [head, rm]);
  const dat = [1, 2, 3]
  return (
    <>
      <div className="flex flex-col text-lg m-2 p-1 gap-5 mt-4">
        <div>
          <label className="font-semibold p-1">Vertical Head:</label>
          <select className="shadow-xl border rounded-lg" value={head} onChange={(e) => { sethead(e.target.value) }}>
            <option value="">Select Head</option>
            {headOptions.map(option => (<option key={option._id} value={option._id}>{option.name}</option>))}
          </select>
        </div>
        <div>
          <label className="font-semibold p-1">Relationship Manager:</label>
          <select className="shadow-xl border rounded-lg" value={rm} onChange={(e) => { setrm(e.target.value) }}>
            <option value="">Select RM</option>
            {rmOptions.map(option => (<option key={option._id} value={option._id}>{option.name}</option>))}
          </select>
        </div>
        <div>
          <label className="font-semibold p-1">Agent</label>
          <select className="shadow-xl border rounded-lg" value={agent} onChange={(e) => { setagent(e.target.value) }}>
            <option value="">Select Agent</option>
            {agentOptions.map(option => (<option key={option._id} value={option._id}>{option.name}</option>))}
          </select>
        </div>
        <button className="border shadow-xl max-w-[150px] py-2 rounded-xl bg-orange-500 font-semibold text-white" onClick={() => { getPolicy(setPolicies, head, rm, agent); setPolicyExist(true); }}>Get policies</button>
      </div>
      {policyexist && <div>{dat + 1}</div>}
    </>
  )
}

export default Admin
