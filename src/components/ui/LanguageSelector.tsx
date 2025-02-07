import { LANGUAGES } from "@/constants";
import * as Select from "@radix-ui/react-select";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaGlobe } from "react-icons/fa";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Select.Root value={i18n.language} onValueChange={changeLanguage}>
      <Select.Trigger
        className="flex items-center gap-2 rounded-lg border-none bg-transparent p-2 transition-colors hover:text-primary-40"
        aria-label="Language"
      >
        <Select.Value>
          <div className="flex items-center gap-2">
            <FaGlobe size={16} />
            <span>{LANGUAGES[i18n.language as keyof typeof LANGUAGES]}</span>
          </div>
        </Select.Value>

        <Select.Icon>
          <FaChevronDown size={12} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content position="popper" className="z-10 rounded-lg border border-card-border bg-background shadow-lg">
          <Select.Viewport>
            {Object.entries(LANGUAGES).map(([code, lang]) => (
              <Select.Item
                key={code}
                value={code}
                className="flex cursor-pointer items-center gap-2 px-4 py-2 outline-none"
              >
                <Select.ItemText>{lang}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default LanguageSelector;
