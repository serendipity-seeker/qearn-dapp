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
