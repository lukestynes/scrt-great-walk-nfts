## Usage Documentation

### 1. Logging In

To interact with the Great Walks NFT platform, you need to log in using your Keplr Wallet. The application will prompt you to connect your wallet on the homepage.

**Steps to Log In:**
1. Open the application and click "Log In" in the navigation bar.
2. Then hit the "Log In with Keplr Wallet" button.
3. Approve the connection request from Keplr in your browser extension.
4. Once connected, your will be redirected to the dashboard.

### 2. Purchasing Tickets

On the platform, you can purchase NFTs representing tickets for New Zealand's Great Walks. Each NFT contains metadata like the walk name, the date, and your progress along the walk.

**Steps to Purchase a Ticket:**
1. Navigate to the "Purchase" page.
2. Browse the available walks (Only Routeburn) and select the one you wish to purchase, and the date for purchase.
3. Confirm the purchase by interacting with the smart contract through Keplr.
4. Upon successful purchase, the ticket will appear in your "Dashboard" under "Your Walks Tickets."

### 3. The Dashboard

The dashboard displays your current tickets, their status, and information on upcoming walks. You can view your overall progress and completed checkpoints for each ticket.

**Dashboard Sections:**
- **Your Walks Tickets:** Displays all the tickets you've purchased.
  - Each ticket lists:
    - Walk Name
    - Start Date
    - Current Progress (shown as a progress bar)
- **Completed Walks:** Displays badges for fully completed walks, showing the NFT images associated with each walk.

### 4. Ticket Detail Page

Clicking on the name of the walk on your ticket from the Dashboard takes you to the **Ticket Detail Page**, where you can see the full details of your NFT, including your progress and the checkpoints.

**Ticket Detail Page Features:**
- **Checkpoint Progress:** View completed and upcoming checkpoints.
- **Next Checkpoint:** Information about the next checkpoint and any hints provided.
- **Walk Information:** Metadata such as walk name, description, and the number of completed checkpoints.
- **Badge Display:** View the badge associated with the walk based on your progress.

### 5. Advancing Your Token

As you complete real-world checkpoints along your walk, you can advance your NFT token, reflecting your progress in the metadata of the NFT.

(Note: This feature is in replacement of using GPS coordinates to simplify testing for the hackathon.)

**Steps to Advance Your Token:**
1. Go to the detail page of a ticket that is in progress.
2. Click on the "Advance" button when you’ve reached the next checkpoint in the walk.
3. The application will send an **AdvanceToken** transaction to the smart contract.
4. If successful, your NFT’s metadata will be updated, moving your progress forward and unlocking the next checkpoint.

Keep track of your progress and fully complete a walk to earn the final badge associated with the trail!

---

This guide covers the essential features of the Great Walks NFT platform.
