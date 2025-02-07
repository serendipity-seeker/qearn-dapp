import * as Switch from "@radix-ui/react-switch";
import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { settingsAtom } from "@/store/settings";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/ui/LanguageSelector";

const Settings: React.FC = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const { t } = useTranslation();

  const SwitchComponent = ({
    checked,
    onChange,
    label,
    description,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description: string;
  }) => (
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{label}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        className="relative h-[28px] w-[42px] cursor-default rounded-full border-2 border-gray-50 p-0 outline-none focus:ring data-[state=checked]:bg-black"
      >
        <Switch.Thumb className="absolute left-0.5 block size-[20px] -translate-y-1/2 rounded-full bg-white transition-all duration-500 will-change-transform data-[state=checked]:left-auto data-[state=checked]:right-0.5" />
      </Switch.Root>
    </div>
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Card className="rounded-xl bg-card p-8 shadow-lg">
        <h1 className="mb-8 text-center text-3xl font-bold tracking-tight">{t("common.Settings")}</h1>

        <div className="space-y-8">
          {/* Tick Offset Section */}
          <section className="rounded-lg bg-white/5 p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{t("common.Tick Offset")}</h3>
                <p className="text-sm text-gray-400">{t("common.Current value: {{value}}", { value: settings.tickOffset })}</p>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                value={settings.tickOffset}
                onChange={(e) => setSettings((prev) => ({ ...prev, tickOffset: parseInt(e.target.value) }))}
                className="w-full sm:w-48"
                step="1"
              />
            </div>
          </section>

          {/* Dark Mode Section */}
          <section className="rounded-lg bg-white/5 p-6">
            <SwitchComponent
              checked={settings.darkMode}
              onChange={(checked) => setSettings((prev) => ({ ...prev, darkMode: checked }))}
              label={t("common.Dark Mode")}
              description={t("common.Toggle dark mode theme")}
            />
          </section>

          {/* Developer Page Section */}
          <section className="rounded-lg bg-white/5 p-6">
            <SwitchComponent
              checked={settings.showDeveloperPage}
              onChange={(checked) => setSettings((prev) => ({ ...prev, showDeveloperPage: checked }))}
              label={t("common.Developer Page")}
              description={t("common.Show developer page")}
            />
          </section>

          {/* Transfer Form Section */}
          <section className="rounded-lg bg-white/5 p-6">
            <SwitchComponent
              checked={settings.showTransferForm}
              onChange={(checked) => setSettings((prev) => ({ ...prev, showTransferForm: checked }))}
              label={t("common.Transfer Form")}
              description={t("common.Show transfer form")}
            />
          </section>

          {/* Language Section */}
          <section className="rounded-lg bg-white/5 p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <h3 className="text-xl font-semibold">{t("common.Language")}</h3>
              <LanguageSelector />
            </div>
          </section>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
