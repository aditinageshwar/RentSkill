import React, { useContext, useState } from "react";
import { SkillContext } from "../App";

const BrowseSkill = () => {
  const { providers } = useContext(SkillContext);
  const [searchSkill, setSearchSkill] = useState("");

  const filteredProviders = providers.filter(
    (provider) =>
      provider.skill.toLowerCase().includes(searchSkill.toLowerCase()) &&
      provider.isOnline
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Browse Skills</h2>
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter skill (e.g., JavaScript)"
          className="p-2 border border-gray-300 rounded-md focus:outline-none"
          value={searchSkill}
          onChange={(e) => setSearchSkill(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => (
          <div
            key={provider.id}
            className="border border-gray-300 rounded-md p-4 shadow-md"
          >
            <h3 className="text-lg font-semibold">{provider.name}</h3>
            <p>Skill: {provider.skill}</p>
            <p>Status: {provider.isOnline ? "Online" : "Offline"}</p>
          </div>
        ))}
        {filteredProviders.length === 0 && (
          <p className="text-gray-500">No providers found.</p>
        )}
      </div>
    </div>
  );
};

export default BrowseSkill;
