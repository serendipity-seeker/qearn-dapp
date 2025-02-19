import * as Switch from "@radix-ui/react-switch";
import * as Slider from "@radix-ui/react-slider";
import Card from "@/components/ui/Card";
import { settingsAtom } from "@/store/settings";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { MdDarkMode, MdCode, MdSwapHoriz, MdLanguage, MdTimer } from "react-icons/md";

const Settings: React.FC = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const { t } = useTranslation();

  const SwitchComponent = ({
    checked,
    onChange,
    label,
    description,
    icon,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description: string;
    icon: React.ReactNode;
  }) => (
    <div className="flex gap-2 sm:gap-4 sm:items-center justify-between">
      <div className="flex flex-1 items-center gap-2 sm:gap-4">
        <div className="mt-1 text-primary-40">{icon}</div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{label}</h3>
          <p className="text-muted-foreground text-xs sm:text-sm">{description}</p>
        </div>
      </div>
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        className="relative h-[24px] w-[36px] cursor-default rounded-full border-2 border-gray-50 p-0 outline-none focus:ring data-[state=checked]:bg-black sm:h-[28px] sm:w-[42px]"
      >
        <Switch.Thumb className="absolute left-0.5 block size-[16px] -translate-y-1/2 rounded-full bg-white transition-all duration-500 will-change-transform data-[state=checked]:left-auto data-[state=checked]:right-0.5 sm:size-[20px]" />
      </Switch.Root>
    </div>
  );

  return (
    <div className="container mx-auto max-w-4xl px-2 py-4 sm:px-4 sm:py-8">
      <Card className="rounded-xl bg-card p-4 shadow-lg sm:p-8">
        <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-primary-40 sm:mb-8 sm:text-3xl">
          {t("common.Settings")}
        </h1>

        <div className="space-y-4 sm:space-y-6">
          {/* Tick Offset Section */}
          <section className="bg-card/50 rounded-lg p-4 shadow-sm ring-1 ring-gray-200/20 sm:p-6">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 justify-between">
              <div className="flex items-center gap-4">
                <div className="mt-1 text-primary-40">
                  <MdTimer className="size-6 sm:size-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{t("common.Tick Offset")}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {t("common.Current value: {{value}}", { value: settings.tickOffset })}
                  </p>
                </div>
              </div>
              <Slider.Root
                className="relative flex w-full max-w-md touch-none select-none items-center"
                value={[settings.tickOffset]}
                onValueChange={(value) => setSettings({ tickOffset: value[0] })}
                max={15}
                min={3}
                step={1}
              >
                <Slider.Track className="relative h-1.5 grow rounded-full bg-gray-200 sm:h-2">
                  <Slider.Range className="absolute h-full rounded-full bg-primary-40" />
                </Slider.Track>
                <Slider.Thumb
                  className="block size-4 rounded-full bg-primary-40 shadow-lg ring-offset-2 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-40/50 sm:size-5"
                  aria-label="Tick offset"
                />
              </Slider.Root>
            </div>
          </section>

          {/* Dark Mode Section */}
          <section className="bg-card/50 rounded-lg p-4 shadow-sm ring-1 ring-gray-200/20 sm:p-6">
            <SwitchComponent
              checked={settings.darkMode}
              onChange={(checked) => setSettings({ darkMode: checked })}
              label={t("common.Dark Mode")}
              description={t("common.Toggle dark mode theme")}
              icon={<MdDarkMode className="size-6 sm:size-8" />}
            />
          </section>

          {/* Developer Page Section */}
          <section className="bg-card/50 rounded-lg p-4 shadow-sm ring-1 ring-gray-200/20 sm:p-6">
            <SwitchComponent
              checked={settings.showDeveloperPage}
              onChange={(checked) => setSettings({ showDeveloperPage: checked })}
              label={t("common.Developer Page")}
              description={t("common.Show developer page")}
              icon={<MdCode className="size-6 sm:size-8" />}
            />
          </section>

          {/* Transfer Form Section */}
          <section className="bg-card/50 rounded-lg p-4 shadow-sm ring-1 ring-gray-200/20 sm:p-6">
            <SwitchComponent
              checked={settings.showTransferForm}
              onChange={(checked) => setSettings({ showTransferForm: checked })}
              label={t("common.Transfer Form")}
              description={t("common.Show transfer form")}
              icon={<MdSwapHoriz className="size-6 sm:size-8" />}
            />
          </section>

          {/* Language Section */}
          <section className="bg-card/50 rounded-lg p-4 shadow-sm ring-1 ring-gray-200/20 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="text-primary-40">
                  <MdLanguage className="size-6 sm:size-8" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{t("common.Language")}</h3>
              </div>
              <LanguageSelector />
            </div>
          </section>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
