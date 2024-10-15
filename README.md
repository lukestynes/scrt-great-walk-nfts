# Great Walk NFT Experience

## Overview
The Great Walks NFT Ticketing System is an innovative platform for managing walk reservations for popular trails through the power of NFTs. Users can mint NFTs as digital tickets representing their participation in a specific walk. These NFTs track progress along the trails, provide hints for upcoming checkpoints, and reward users with a digital badge upon completion of the walk.

## User-Focused Summary

The **Great Walk NFT Experience** is an interactive way to engage with New Zealand’s iconic Great Walks. Upon purchasing a ticket for a walk, you receive a unique **NFT** that evolves as you progress through your journey. As you check in at huts or specific points along the walk, your NFT updates to reflect your progress, ultimately becoming a **badge of completion** that represents your adventure and accomplishments.

This is more than just a ticket—it's a **dynamic collectible** that grows with your journey.

- **Start** by purchasing a ticket and receiving an NFT.
- **Check-in** at huts or landmarks using your location.
- **Watch your NFT evolve** from a simple token to a detailed badge of completion.
- **Show off** your NFT to prove that you've completed one of New Zealand’s most famous hikes.

## Investor Pitch

### Problem It Solves

The **Great Walk NFT Experience** solves the problem of passive and impersonal ticketing for outdoor adventures. Traditional tickets or badges often fail to capture the true essence of an experience, offering no real engagement beyond the transaction itself. Additionally, there’s a growing interest in digital collectibles, particularly among younger, tech-savvy adventurers, but there’s little integration of this technology in the outdoor recreation space.

By turning Great Walk tickets into evolving NFTs, this project creates a **new way to enhance personal achievements**, allowing users to **track their progress and own a unique, evolving digital asset** that serves as a badge of their adventure.

### Product Market Fit

The **Great Walk NFT Experience** appeals to:

- **Outdoor enthusiasts** looking for new ways to commemorate their experiences.
- **NFT collectors** who enjoy digital assets with utility and evolution.
- **Tourism operators** who want to integrate modern technology into traditional outdoor activities.
- **Gamification and experience-based marketing** for travel agencies, creating a new stream of engagement.

We’re entering the intersection of **outdoor adventure** and **digital collectibles**, providing a product that captures the best of both worlds.

## Development Deep Dive

The project is built on **Secret Network** for privacy-preserving NFTs, ensuring that while users can publicly showcase their achievements, their data and information are handled securely and privately.
This also means that only the owner of the token can see the current walk hints and locations, and even the owner can't see the future hints and locations, all thanks to SecretNetwork.

### Technologies Used

- **Secret Network:** For secure, privacy-preserving NFTs.
- **React/Next.js:** The frontend is built using a modern web stack to provide a seamless user experience, deployed on Vercel.
- **Smart Contracts:** Smart contracts on Secret Network are used to manage NFT minting, evolution, and location-based updates.

### Contracts and Interactions

1. **NFT Minting:** When a user purchases a ticket, a smart contract is triggered to mint an NFT that is uniquely tied to that user and their specific walk.
2. **Location Updates:** As users progress along the Great Walk, the smart contract listens for **location check-ins** (done at huts or specific GPS points). These check-ins trigger **updates** to the user's NFT, visually evolving it to represent new progress milestones.
3. **NFT Evolution:** The NFT design evolves dynamically. The user’s final NFT will include **visual markers of completion**, such as specific huts visited, unique trail challenges completed, and total progress.

### Design Choices

- **Privacy Focused:** Secret Network was chosen because user location is sensitive data. We want users to feel confident that their journey and data are private, with control over how much they share publicly.
- **Evolutionary NFTs:** The dynamic nature of the NFT makes it more engaging and valuable. The more effort a user puts into their hike, the more their NFT reflects it.
- **User-Centric UX:** The platform design emphasizes ease of use, requiring minimal tech expertise to check in or track NFT evolution. The focus is on making the experience accessible for both seasoned NFT collectors and complete newcomers.

---

## License

This project is licensed under the [MIT License](LICENSE).

## Contributors

- [Luke Stynes](https://www.github.com/lukestynes)
