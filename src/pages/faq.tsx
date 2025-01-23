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
            content: 'Qearn is a platform that allows you to lock your QUBIC tokens and earn rewards. The more you lock, the more rewards you earn.',
          },
          {
            title: 'What are the benefits of locking?',
            content: (
              <>
                <p>Locking provides several benefits including:</p>
                <ul className="list-disc list-inside mt-2 text-muted-foreground">
                  <li>Earning passive rewards</li>
                  <li>Supporting network security</li>
                  <li>Bring token price stability</li>
                </ul>
              </>
            ),
          },
          {
            title: 'How can I get started?',
            content: 'To get started, connect your wallet using the connect button in the top right corner. Once connected, you can navigate to the Locking page to stake your QUBIC tokens.',
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
            className="bg-card rounded-lg p-6 border border-card-border"
          >
            <h2 className="text-xl font-semibold mb-3">{faq.title}</h2>
            <div className="text-muted-foreground">{faq.content}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Faq;
