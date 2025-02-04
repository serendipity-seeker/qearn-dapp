import { Switch, Disclosure } from "@headlessui/react";
import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { settingsAtom } from "@/store/settings";
import { useAtom } from "jotai";
import { DEFAULT_TICK_OFFSET } from "@/constants";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/ui/LanguageSelector";

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [tickOffset, setTickOffset] = useState(DEFAULT_TICK_OFFSET);
  const [, setSettings] = useAtom(settingsAtom);
  const { t } = useTranslation();

  useEffect(() => {
    setSettings((prev) => ({ ...prev, darkMode, notifications, tickOffset }));
  }, [darkMode, notifications, tickOffset]);

  return (
    <Card className="max-w-lg p-6">
      <div className="space-y-4">
        <h1 className="text-center text-3xl">{t("common.Settings")}</h1>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{t("common.Tick Offset")}</h3>
              <p className="text-sm">{t("common.Current value: {{value}}", { value: tickOffset })}</p>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              value={tickOffset}
              onChange={(e) => setTickOffset(parseInt(e.target.value))}
              className="w-32"
              step="1"
            />
          </div>

          <div className="space-y-4">
            <Disclosure>
              {({}) => (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">{t("common.Dark Mode")}</h3>
                      <p className="text-sm">{t("common.Toggle dark mode theme")}</p>
                    </div>
                    <Switch
                      checked={darkMode}
                      onChange={setDarkMode}
                      className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[checked]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                      />
                    </Switch>
                  </div>
                </>
              )}
            </Disclosure>

            <Disclosure>
              {({}) => (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">{t("common.Notifications")}</h3>
                      <p className="text-sm">{t("common.Manage notification preferences")}</p>
                    </div>
                    <Switch
                      checked={notifications}
                      onChange={setNotifications}
                      className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[checked]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                      />
                    </Switch>
                  </div>
                </>
              )}
            </Disclosure>
          </div>

          <div className="flex items-center gap-4">
            <span>{t("common.Language")}</span>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Settings;
