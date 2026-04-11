import Sadebar from "./component/Sadebar.jsx";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add.jsx";
import List from "./pages/List.jsx";
import Order from "./pages/Order.jsx";
import Edit from "./pages/Edit.jsx";
import { useEffect, useState } from "react";
import Login from "./component/Login.jsx";
import { ToastContainer } from "react-toastify";
import Shipping from "./pages/Shipping.jsx";

export const backendUrl = "http://localhost:4000";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isOpen, setIsOpen] = useState(false); // ✅ مهم

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
      <div className="bg-gray-50 min-h-screen">
        <ToastContainer />

        {token === "" ? (
            <Login setToken={setToken} />
        ) : (
            <>
              <hr />

              <div className="flex w-full">
                <Sadebar
                    setToken={setToken}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />

                <div className="w-[100%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
                  <Routes>
                    <Route path="/add" element={<Add token={token} />} />
                    <Route path="/" element={<List token={token} />} />
                    <Route path="/orders" element={<Order token={token} />} />
                    <Route path="/edit/:id" element={<Edit token={token} />} />
                    <Route path="/edit" element={<Edit token={token} />} />
                      <Route path="/shipping" element={<Shipping token={token} />} />
                  </Routes>
                </div>
              </div>
            </>
        )}
      </div>
  );
}

export default App;