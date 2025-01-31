import { motion } from 'framer-motion';

const Faq: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container mx-auto px-4 py-8">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-3xl font-bold text-center mb-12">
        Frequently Asked Questions
      </motion.h1>

      <div className="max-w-3xl mx-auto space-y-6">
        {[
          {
            title: 'What is Qearn?',
            content:
              'Qearn is a smart contract-based platform that allows users to lock funds for rewards while offering flexible unlocking options with associated penalties for early unlocking. It’s designed to incentivize long-term participation while maintaining liquidity for users.',
          },
          {
            title: 'How does Qearn generate rewards?',
            content: 'Rewards in Qearn are distributed from the bonus pool allocated to each epoch. These rewards are calculated based on the total locked amount and the epoch bonus allocation.',
          },
          {
            title: 'What is an epoch in Qearn?',
            content:
              'An epoch is a time period during which locking and unlocking activities are managed. In Qearn, epochs are tracked weekly, with each user’s lock duration and rewards calculated based on these intervals.',
          },
          {
            title: 'What is the minimum amount required to lock funds?',
            content: 'The minimum locking amount is 10,000,000 Qubic. Any attempt to lock less will result in a failed transaction.',
          },
          {
            title: 'Is there a maximum amount I can lock?',
            content: 'Yes, the maximum lock amount per user in a single epoch is 1,000,000,000,000 Qubic.',
          },
          {
            title: 'Can I lock funds multiple times in the same epoch?',
            content: ' Yes, you can lock funds multiple times in the same epoch. The amounts will be aggregated, provided the total does not exceed the maximum lock limit.',
          },
          {
            title: 'Can I unlock my funds early?',
            content: (
              <>
                <p>Yes, early unlocking is allowed but comes with penalties:</p>
                <ul className="list-disc list-inside mt-2 text-muted-foreground">
                  <li>
                    <span className="font-bold">Reduced rewards:</span> Depending on how early you unlock, a percentage of the rewards will be forfeited.
                  </li>
                  <li>
                    <span className="font-bold">Burned amount:</span> A portion of the unlocked amount will be burned, decreasing the circulating supply.
                  </li>
                </ul>
              </>
            ),
          },
          {
            title: 'What are the penalties for early unlocking?',
            content: (
              <>
                <p>Penalties vary based on how many weeks your funds were locked. For example:</p>
                <ul className="list-disc list-inside mt-2 text-muted-foreground">
                  <li>
                    Unlocking after 4-7 weeks incurs a <span className="font-bold">5% reward penalty</span> and a <span className="font-bold">45% burn rate</span>.
                  </li>
                  <li>
                    Unlocking after 36-39 weeks incurs a <span className="font-bold">40% reward penalty</span> and a <span className="font-bold">30% burn rate</span>.
                  </li>
                </ul>
              </>
            ),
          },
          {
            title: 'What happens if I keep my funds locked for the full period?',
            content: 'If you lock your funds for the full 52 weeks, you will receive the maximum rewards and incur no penalties.',
          },
          {
            title: 'How are rewards calculated?',
            content: 'Rewards are calculated based on the epoch&apos;s bonus pool and the total locked amount. The yield is proportional to your share of the locked funds in the epoch.',
          },
          {
            title: 'Are bonuses fixed or variable?',
            content: ' Bonuses are variable and depend on the funds available in the bonus pool at the start of each epoch. Unused bonuses are burned at the end of an epoch.',
          },
          {
            title: 'How can I connect wallet to this dapp?',
            content: (
              <>
                <h4 className="font-medium mb-4">There are 4 ways to connect wallet to this dapp, with varying levels of security:</h4>
                <ul className="space-y-4">
                  <li className="space-y-2">
                    <h5 className="font-medium text-primary-40">1. MetaMask Snap (Recommended)</h5>
                    <p className="text-muted-foreground">
                      The most secure way to connect. MetaMask Snap provides a sandboxed environment that never exposes your private keys. Simply install the MetaMask browser extension and the Qubic
                      Snap to get started.
                    </p>
                  </li>
                  <li className="space-y-2">
                    <h5 className="font-medium text-primary-40">2. WalletConnect</h5>
                    <p className="text-muted-foreground">
                      A secure protocol that connects your mobile wallet to this dapp without exposing sensitive data. Scan the QR code with a WalletConnect-compatible wallet to establish an encrypted
                      connection.
                    </p>
                  </li>
                  <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 my-4">
                    <p className="text-red-500 font-medium">⚠️ Security Warning</p>
                    <p className="text-red-400 text-sm mt-1">
                      The following connection methods require storing sensitive key data in the dapp. Only use these methods if you fully understand the risks.
                    </p>
                  </div>
                  <li className="space-y-2">
                    <h5 className="font-medium">3. Vault File</h5>
                    <p className="text-muted-foreground">
                      Connect using your encrypted Qubic vault file and password. While the vault is encrypted, the decrypted keys are stored in the dapp's memory. Always keep your vault file and
                      password private.
                    </p>
                  </li>
                  <li className="space-y-2">
                    <h5 className="font-medium">4. Private Key</h5>
                    <p className="text-muted-foreground">
                      Direct private key entry should only be used as a last resort. Your private key grants complete control over your funds - never share it with anyone and only use this method on a
                      secure, trusted device.
                    </p>
                  </li>
                </ul>
              </>
            ),
          },
          {
            title: 'Need more help?',
            content: 'For direct support from our team and community members, please join our Qubic community, ask to MrUnhappyX.',
          },
        ].map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * (index + 1), duration: 0.5 }}
            className="bg-card rounded-lg p-6 border border-card-border text-ellipsis"
          >
            <h2 className="text-xl font-semibold mb-3">{faq.title}</h2>
            <div className="text-muted-foreground text-justify">{faq.content}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Faq;
