import { Switch, Disclosure } from '@headlessui/react';
import { useState } from 'react';
import Card from '@/components/ui/Card';

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [sliderValue, setSliderValue] = useState(3);

  return (
    <Card className="max-w-lg p-6">
      <div className="space-y-4">
        <h1 className="text-3xl text-center">Settings</h1>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Tick Offset</h3>
              <p className="text-sm">Current value: {sliderValue}</p>
            </div>
            <input type="range" min="3" max="15" value={sliderValue} onChange={(e) => setSliderValue(parseInt(e.target.value))} className="w-32" step="1" />
          </div>

          <div className="space-y-4">
            <Disclosure>
              {({ open }) => (
                <>
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Dark Mode</h3>
                      <p className="text-sm">Toggle dark mode theme</p>
                    </div>
                    <Switch
                      checked={darkMode}
                      onChange={setDarkMode}
                      className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                      />
                    </Switch>
                  </div>
                </>
              )}
            </Disclosure>

            <Disclosure>
              {({ open }) => (
                <>
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Notifications</h3>
                      <p className="text-sm">Manage notification preferences</p>
                    </div>
                    <Switch
                      checked={notifications}
                      onChange={setNotifications}
                      className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                      />
                    </Switch>
                  </div>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Settings;
