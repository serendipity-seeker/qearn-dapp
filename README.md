# QEARN dApp

![image](https://github.com/user-attachments/assets/20b3cf7d-e5b5-4d7d-98cb-cf83dda10bdc)

## Introduction to Qearn

Qearn is a revolutionary staking mechanism designed to reduce Qubic's circulating supply while providing attractive risk-free yields to token holders. The core concept involves allocating 100B QU per week as rewards for users who lock their tokens for 52 weeks.

### Key Features

- **Weekly Locking**: Users can lock their QU tokens for 52 weeks to earn proportional rewards from the 100B QU weekly allocation
- **Flexible Unlocking**: Tokens can be unlocked early with penalties that include burns and reduced rewards
- **Yield Discovery**: Minimum yield is determined at the end of each weekly locking period based on total locked amount
- **Supply Control**: Reduces circulating supply through locking and burning mechanisms
- **Risk-Free Returns**: No impermanent loss risk as only QU tokens are involved

### How it Works

1. Each week, 100B QU is allocated as rewards
2. Users lock their tokens for 52 weeks
3. Rewards are distributed proportionally to locked amounts
4. Early unlocking incurs penalties:
   - Portion of rewards burned
   - Reduced reward payout
   - Remaining rewards boost yields for other participants

### Example Scenario

If 800B QU is locked and remains locked for 52 weeks:

- Minimum yield: 12.5%
- If 300B unlocks early, yield for remaining holders increases to 20%
- Early unlock penalties follow a graduated scale based on unlock timing

### Qearn yield table

| Week-From | Week-To | Early Unlock % | Burn % | Boost % |
| --------- | ------- | -------------- | ------ | ------- |
| 0         | 3       | 0              | 0      | 100     |
| 4         | 7       | 5              | 45     | 50      |
| 8         | 11      | 5              | 45     | 50      |
| 12        | 15      | 10             | 45     | 45      |
| 16        | 19      | 15             | 40     | 45      |
| 20        | 23      | 20             | 40     | 40      |
| 24        | 27      | 25             | 35     | 40      |
| 28        | 31      | 30             | 35     | 35      |
| 32        | 35      | 35             | 35     | 30      |
| 36        | 39      | 40             | 30     | 30      |
| 40        | 43      | 45             | 30     | 25      |
| 44        | 47      | 50             | 30     | 20      |
| 48        | 51      | 55             | 25     | 20      |
| 52        | 52      | 100            | 0      | 0       |

## Qearn dApp

Qearn is built on a robust architecture consisting of two core components:

1. A secure smart contract deployed on the Qubic network (epoch 137) that handles all token locking, rewards distribution, and unlocking logic
2. An intuitive frontend web application that seamlessly integrates with both the Qubic web wallet and standalone usage

The protocol's launch in epoch 138 saw extraordinary adoption, with users locking approximately 8T QU within the first two weeks (epochs 138-139). This rapid uptake demonstrated the community's strong confidence in Qearn's security, design, and potential returns.

The Qearn dApp offers a comprehensive suite of features:

- Simple one-click token locking with customizable durations
- Real-time analytics dashboard showing total locked value, APY, and market metrics
- Complete transaction history and performance reporting

To serve our growing mobile user base, we developed a standalone progressive web application (PWA) that delivers the full Qearn experience on any device. While App Store restrictions prevented direct mobile wallet integration, our PWA solution ensures all users have equal access to Qearn's functionality.

The application employs responsive design principles and mobile-first development practices to provide an optimal experience across all screen sizes. Users can seamlessly manage their positions through either:

- The integrated Qubic web wallet interface
- Our standalone dApp accessible via any modern web browser
- The mobile-optimized PWA installable on iOS and Android devices

## Documentations

- [QEarn: Qubics path to high yields and reduced supply](https://medium.com/@cryptopion33r/qearn-the-path-to-high-yields-and-reduced-qubic-supply-21fecf5d3c32)
- [Qearn for risk free yield by locking QU](https://medium.com/@qsilver97/qearn-for-risk-free-yield-by-locking-qu-12f3fbe23706)
