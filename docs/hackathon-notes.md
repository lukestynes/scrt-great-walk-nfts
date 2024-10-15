# Hackathon Notes

## Simplifications for the Hackathon

This project was built under hackathon constraints, and some features were simplified for ease of development and testing. Below are some of the hackathon-specific implementations:

### Public Image Files
For simplicity, the NFT badge images are made publicly available on the frontend. In a real-world implementation, these assets would ideally be securely stored and served based on NFT ownership, and they would also probably me on IPFS.

### Single Walk per Contract
Currently, the contract is designed for a single walk (e.g., Routeburn Track). This was done to keep the scope manageable. Ideally, multiple walks would be supported within the same contract to allow users to purchase tickets for different tracks.

### Check-In Button Instead of GPS
Due to time constraints and ease of testing, the project uses a "Check-In" button for advancing to the next checkpoint instead of GPS location-based progression. In a full-featured application, GPS data would be used to verify a user's physical presence at each checkpoint.

### Permit and Wallet Simplification
The current implementation simplifies user authentication with Keplr by using viewing permits and basic wallet interactions. For a more secure and scalable approach, additional authorization methods could be considered.

---

These changes were made to ensure a working demo could be completed within the hackathon's timeframe while keeping future scalability in mind.
