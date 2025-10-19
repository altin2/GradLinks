import InputForm from "../../LoginPg/components/InputForm.tsx";
import React, { useState, useEffect } from "react";
import {
  returnGradInfo,
  updateGradInfo,
  returnEmpInfo,
  updateProfile,
  updateEmpInfo,
} from "./functions/ProfileRoutes.tsx";
import supabase from "../../../supabase-Client.js";
import { toast } from "react-toastify";
import LargeInputForm from "./LargeInpForm.tsx";
import emptypfp from "../../universal_components/universal_assets/emptypfp.svg";
import "../Index.css";
interface GradFormProps {
  url: string | null;
}

export function GradForm({ url }: GradFormProps) {
  const [imgUrl, setImgUrl] = useState<string>(emptypfp);
  const [inputs, setInputs] = useState({
    firstname: "",
    lastname: "",
    midname: "",
    age: "",
  });
  useEffect(() => {
    const fetchGradStatus = async () => {
      const UserGrad = await returnGradInfo();
      setInputs((prev) => ({
        ...prev,
        firstname: UserGrad.first_name,
        lastname: UserGrad.last_name,
        midname: UserGrad.middle_name,
        age: UserGrad.age,
      }));
    };
    fetchGradStatus();
  }, []);
  useEffect(() => {
    if (url) {
      setImgUrl(url);
    }
  }, [url]);
  const { firstname, lastname, midname, age } = inputs;

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 30).replace(/[^a-zA-Z-]/g, "");
    if (/^[a-zA-Z'-]*$/.test(val)) {
      setInputs({ ...inputs, [e.target.name]: val });
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    if (!e.target.files?.[0].type.startsWith("image/")) {
      toast.error(
        "Please upload a valid image file (e.g., .png, .jpg, .jpeg, .gif)."
      );
      return;
    } else if (e.target.files?.[0].size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB.");
      return;
    }
    await updateProfile(e.target.files?.[0]);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { data } = supabase.storage
      .from("user_pfps")
      .getPublicUrl(`Public/${session?.user.id}`);

    if (data) {
      // Force browser to reload the new image
      setImgUrl(`${data.publicUrl}?t=${Date.now()}`);
    }
  };
  const handleUpdate = async (e: any) => {
    e.preventDefault();
    if (Number(age) < 15 || Number(age) > 100) {
      toast.error("Age must be between 15 and 100");
      return;
    }
    const body = {
      first_name: firstname,
      last_name: lastname,
      middle_name: midname,
      age,
    };
    const response = await updateGradInfo(body);

    response === "Success" ? toast.success(response) : toast.error(response);
  };
  return (
    <form
      onSubmit={handleUpdate}
      className="form-container-grad"
      data-testid="gradForm"
      noValidate
    >
      <h1 className="header">Update your personal information</h1>
      <h1 className="titletxt">Update Profile Picture:</h1>
      <input
        type="file"
        name="file"
        onChange={uploadImage}
        className="center-inputs"
        data-testid="Image"
      />
      <img
        src={imgUrl}
        className="img-container-2"
        alt="Profile"
        onError={() => setImgUrl(emptypfp)}
      />
      <div className="side-by-side">
        <h1 className="titletxt-form">First name</h1>
        <h1 className="titletxt-form"> Middle name</h1>
        <h1 className="titletxt-form"> Last name</h1>
      </div>
      <div className="side-by-side split">
        <InputForm
          img={null}
          onChange={onChangeName}
          name="firstname"
          value={firstname}
          type="text"
          placeholder="First Name"
          small={true}
          data-testid="FirstName"
          max={30}
        />
        <InputForm
          img={null}
          onChange={onChangeName}
          name="midname"
          value={midname}
          type="text"
          placeholder="Middle Name"
          small={true}
          data-testid="MiddleName"
          max={30}
        />
        <InputForm
          img={null}
          onChange={onChangeName}
          name="lastname"
          value={lastname}
          type="text"
          placeholder="Last Name"
          small={true}
          data-testid="LastName"
          max={30}
        />
      </div>
      <h1 className="titletxt">Age</h1>
      <div className="center">
        <InputForm
          img={null}
          onChange={onChange}
          name="age"
          value={age}
          type="number"
          placeholder="Age"
          small={true}
          min={15}
          max={100}
          data-testid="Age"
        />
      </div>

      <div className="submit-container">
        <button className="submit" data-testid="UpdateBtn">
          Update
        </button>
      </div>
    </form>
  );
}
export function EmployerForm({ url }: GradFormProps) {
  const [imgUrl, setImgUrl] = useState<string>("");
  const [inputs, setInputs] = useState({
    compname: "",
    bio: "",
    verified: false,
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchEmpStatus = async () => {
      const UserEmp = await returnEmpInfo();
      setInputs((prev) => ({
        ...prev,
        compname: UserEmp.company_name,
        bio: UserEmp.bio,
        verified: UserEmp.isVerified,
      }));
    };
    fetchEmpStatus();
  }, []);
  useEffect(() => {
    if (url) {
      setImgUrl(url);
    }
  }, [url]);
  const { compname, bio } = inputs;
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    if (!e.target.files?.[0].type.startsWith("image/")) {
      toast.error(
        "Please upload a valid image file (e.g., .png, .jpg, .jpeg, .gif)."
      );
      return;
    } else if (e.target.files?.[0].size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB.");
      return;
    }
    await updateProfile(e.target.files?.[0]);

    await updateProfile(e.target.files[0]);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { data } = supabase.storage
      .from("user_pfps")
      .getPublicUrl(`Public/${session?.user.id}`);

    if (data) {
      // Force browser to reload the new image
      setImgUrl(`${data.publicUrl}?t=${Date.now()}`);
    }
  };
  const onChange = (e: any) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value.slice(0, 1000) });
  const onChangeName = (e: any) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value.slice(0, 50) });
  // Trigger LinkedIn OAuth linking
  const handleVerify = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.linkIdentity({
      provider: "linkedin_oidc",
    });
    console.log(data);
    if (error) {
      console.error("Error linking LinkedIn:", error.message);
      toast.error("Could not connect LinkedIn account. Try again.");
    } else {
      // Check if LinkedIn is now in identities
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const linked = session?.user.identities?.some(
        (id) => id.provider === "linkedin_oidc"
      );
      if (linked) {
        const body = { company_name: compname, bio, isVerified: true };

        const response = await updateEmpInfo(body);
        response === "Success"
          ? toast.success(response)
          : toast.error(response);
      }
    }
    setLoading(false);
  };
  const handleUpdate = async (e: any) => {
    e.preventDefault();
    const body = { company_name: compname, bio };

    const response = await updateEmpInfo(body);
    response === "Success" ? toast.success(response) : toast.error(response);
  };
  return (
    <form onSubmit={handleUpdate} className="form-container">
      {!inputs.verified ? (
        <div className="">
          <button
            onClick={handleVerify}
            disabled={loading}
            className="verify-btn"
          >
            {loading ? "Connecting..." : "Verify with LinkedIn"}
          </button>
        </div>
      ) : (
        <></>
      )}
      <h1 className="titletxt">Update Profile Picture:</h1>
      <input
        type="file"
        name="file"
        onChange={uploadImage}
        className="center-inputs"
        data-testid="Image"
      />
      <img
        src={imgUrl}
        className="img-container-2"
        alt="Profile"
        onError={() => setImgUrl(emptypfp)}
        data-testid="ImageShow"
      />

      <h1 className="titletxt">Company name</h1>
      <div className="center">
        <InputForm
          img={null}
          onChange={onChangeName}
          name="compname"
          value={compname}
          type="text"
          placeholder="Company Name"
          small={true}
          max={50}
          data-testid="compName"
        />
      </div>
      <h1 className="titletxt">Company Bio</h1>
      <div className="center">
        <LargeInputForm
          rows={5}
          cols={50}
          placeholder="Company Bio"
          value={bio}
          onChange={onChange}
          name="bio"
          small={true}
          data-testid="compBio"
          maxTxtSize={1000}
        />
      </div>

      <div className="submit-container">
        <button className="submit" data-testid="update">
          Update
        </button>
      </div>
    </form>
  );
}
