import React, { useState, useContext } from "react";
import { SkillContext } from "../App";

const PostSkill = () => {
  const { providers, setProviders } = useContext(SkillContext);
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  const handlePost = () => {
    const newProvider = {
      id: Date.now(),
      name,
      skill,
      isOnline,
    };
    setProviders([...providers, newProvider]);
    setName("");
    setSkill("");
    setIsOnline(true);
    alert("Skill posted successfully!");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Post Skill</h2>
      <div className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="Your Name"
          className="p-2 border border-gray-300 rounded-md focus:outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Skill (e.g., JavaScript)"
          className="p-2 border border-gray-300 rounded-md focus:outline-none"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isOnline}
            onChange={() => setIsOnline(!isOnline)}
          />
          Online
        </label>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={handlePost}
        >
          Post Skill
        </button>
      </div>
    </div>
  );
};

export default PostSkill;
