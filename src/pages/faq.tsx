import { motion } from "framer-motion";
import { Trans, useTranslation } from "react-i18next";

const Faq: React.FC = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-12 text-center text-3xl font-bold"
      >
        {t("faq.Frequently Asked Questions")}
      </motion.h1>

      <div className="mx-auto max-w-3xl space-y-6">
        {[
          {
            title: t("faq.faq1.What is Qearn?"),
            content: t("faq.faq1.content"),
          },
          {
            title: t("faq.faq2.How does Qearn generate rewards?"),
            content: t("faq.faq2.content"),
          },

          {
            title: t("faq.faq3.What is an epoch in Qearn?"),
            content: t("faq.faq3.content"),
          },

          {
            title: t("faq.faq4.What is the minimum amount required to lock funds?"),
            content: t("faq.faq4.content"),
          },

          {
            title: t("faq.faq5.Is there a maximum amount I can lock?"),
            content: t("faq.faq5.content"),
          },

          {
            title: t("faq.faq6.Can I lock funds multiple times in the same epoch?"),
            content: t("faq.faq6.content"),
          },

          {
            title: t("faq.faq7.Can I unlock my funds early?"),
            content: (
              <>
                <p>{t("faq.faq7.Yes, early unlocking is allowed but comes with penalties:")}</p>
                <ul className="text-muted-foreground mt-2 list-inside list-disc">
                  <li>
                    <span className="font-bold">{t("faq.faq7.Reduced rewards:")}</span>{" "}
                    {t("faq.faq7.Depending on how early you unlock, a percentage of the rewards will be forfeited.")}
                  </li>
                  <li>
                    <span className="font-bold">{t("faq.faq7.Burned amount:")}</span>{" "}
                    {t("faq.faq7.A portion of the unlocked amount will be burned, decreasing the circulating supply.")}
                  </li>
                </ul>
              </>
            ),
          },
          {
            title: t("faq.faq8.What are the penalties for early unlocking?"),
            content: (
              <>
                <p>{t("faq.faq8.Penalties vary based on how many weeks your funds were locked. For example:")}</p>

                <ul className="text-muted-foreground mt-2 list-inside list-disc">
                  <li>
                    <Trans
                      i18nKey={t(
                        "faq.faq8.Unlocking after 4-7 weeks incurs a <0>5% reward penalty</0> and a <1>45% burn rate</1>.",
                      )}
                      components={[<span className="font-bold" />, <span className="font-bold" />]}
                    />
                  </li>
                  <li>
                    <Trans
                      i18nKey={t(
                        "faq.faq8.Unlocking after 36-39 weeks incurs a <0>40% reward penalty</0> and a <1>30% burn rate</1>.",
                      )}
                      components={[<span className="font-bold" />, <span className="font-bold" />]}
                    />
                  </li>
                </ul>
              </>
            ),
          },
          {
            title: t("faq.faq9.What happens if I keep my funds locked for the full period?"),
            content: t("faq.faq9.content"),
          },
          {
            title: t("faq.faq10.How are rewards calculated?"),
            content: t("faq.faq10.content"),
          },
          {
            title: t("faq.faq11.Are bonuses fixed or variable?"),
            content: t("faq.faq11.content"),
          },
          {
            title: t("faq.faq12.How can I connect wallet to this dapp?"),
            content: (
              <>
                <h4 className="mb-4 font-medium">
                  {t("faq.faq12.There are 4 ways to connect wallet to this dapp, with varying levels of security:")}
                </h4>
                <ul className="space-y-4">
                  <li className="space-y-2">
                    <h5 className="font-medium text-primary-40">{t("faq.faq12.1. MetaMask Snap (Recommended)")}</h5>
                    <p className="text-muted-foreground">
                      {t(
                        "faq.faq12.The most secure way to connect. MetaMask Snap provides a sandboxed environment that never exposes your private keys. Simply install the MetaMask browser extension and the Qubic Snap to get started.",
                      )}
                    </p>
                  </li>
                  <li className="space-y-2">
                    <h5 className="font-medium text-primary-40">{t("faq.faq12.2. WalletConnect")}</h5>
                    <p className="text-muted-foreground">
                      {t(
                        "faq.faq12.A secure protocol that connects your mobile wallet to this dapp without exposing sensitive data. Scan the QR code with a WalletConnect-compatible wallet to establish an encrypted connection.",
                      )}
                    </p>
                  </li>
                  <div className="my-4 rounded-lg border border-red-500 bg-red-500/10 p-4">
                    <p className="font-medium text-red-500">{t("faq.faq12.⚠️ Security Warning")}</p>
                    <p className="mt-1 text-sm text-red-400">
                      {t(
                        "faq.faq12.The following connection methods require storing sensitive key data in the dapp. Only use these methods if you fully understand the risks.",
                      )}
                    </p>
                  </div>
                  <li className="space-y-2">
                    <h5 className="font-medium">{t("faq.faq12.3. Vault File")}</h5>
                    <p className="text-muted-foreground">
                      {t(
                        "faq.faq12.Connect using your encrypted Qubic vault file and password. While the vault is encrypted, the decrypted keys are stored in the dapp's memory. Always keep your vault file and password private.",
                      )}
                    </p>
                  </li>
                  <li className="space-y-2">
                    <h5 className="font-medium">{t("faq.faq12.4. Private Key")}</h5>
                    <p className="text-muted-foreground">
                      {t(
                        "faq.faq12.Direct private key entry should only be used as a last resort. Your private key grants complete control over your funds - never share it with anyone and only use this method on a secure, trusted device.",
                      )}
                    </p>
                  </li>
                </ul>
              </>
            ),
          },
          {
            title: t("faq.faq13.Need more help?"),
            content: t("faq.faq13.content"),
          },
        ].map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * (index + 1), duration: 0.5 }}
            className="text-ellipsis rounded-lg border border-card-border bg-card p-6"
          >
            <h2 className="mb-3 text-xl font-semibold">{faq.title}</h2>
            <div className="text-muted-foreground">{faq.content}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Faq;
