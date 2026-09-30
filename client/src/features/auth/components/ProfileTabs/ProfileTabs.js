import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

export function ProfileTabs({ tabs }) {
  return (
    <TabGroup>
      <TabList
        className="flex flex-wrap border-b border-gray-200 dark:border-gray-700"
        aria-label="Profil bölümleri"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border-b-2 border-transparent data-selected:border-blue-600 data-selected:text-[rgb(40,100,210)] dark:data-selected:text-yellow-400 focus-visible:outline-2 focus-visible:outline-blue-500"
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>

      <TabPanels className="mt-4">
        {tabs.map((tab) => (
          <TabPanel key={tab.id}>{tab.content}</TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
