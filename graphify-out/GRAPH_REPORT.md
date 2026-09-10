# Graph Report - cow-next  (2026-09-10)

## Corpus Check
- 143 files · ~233,340 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2228 nodes · 3050 edges · 88 communities (47 shown, 40 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3a6f450e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- User.ts
- prismaNamespace.ts
- Booking.ts
- Space.ts
- Payment.ts
- Review.ts
- Conversation.ts
- Payout.ts
- Message.ts
- createClient
- PaymentMethod.ts
- BillingInfo.ts
- commonInputTypes.ts
- HostCreateSpaceForm.tsx
- cn
- BookingCardClient.tsx
- prismaNamespaceBrowser.ts
- What You Must Do When Invoked
- compilerOptions
- PrismaClient
- devDependencies
- components.json
- button.tsx
- dependencies
- mock-data.ts
- SpaceDetailClient.tsx
- BillingInfoDelegate
- BookingDelegate
- ConversationDelegate
- MessageDelegate
- PaymentDelegate
- PaymentMethodDelegate
- PayoutDelegate
- ReviewDelegate
- SpaceDelegate
- UserDelegate
- What You Must Do When Invoked
- host/bookings/page.tsx
- Prisma__UserClient
- graphify reference: extra exports and benchmark
- prisma/client.ts
- enums.ts
- scripts
- layout.tsx
- Prisma__BookingClient
- Prisma__ConversationClient
- Prisma__PaymentClient
- Prisma__ReviewClient
- Prisma__SpaceClient
- Prisma__MessageClient
- Prisma__PayoutClient
- CheckoutClient.tsx
- graphify reference: extra exports and benchmark
- Prisma__BillingInfoClient
- Prisma__PaymentMethodClient
- middleware.ts
- date-fns
- eslint.config.mjs
- package.json
- next
- next.config.ts
- next-themes
- @prisma/adapter-pg
- graphify reference: query, path, explain
- app/page.tsx
- graphify reference: query, path, explain
- tailwind-merge
- vaul
- CoW - Coworking App
- postcss.config.mjs
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native AGENTS.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- PrismaClientBaseOptions
- AGENTS.md
- .agents/skills/graphify/references/extraction-spec.md
- .copilot/skills/graphify/references/extraction-spec.md
- react-day-picker
- react-dom
- @supabase/supabase-js

## God Nodes (most connected - your core abstractions)
1. `cn()` - 129 edges
2. `createClient()` - 48 edges
3. `Button()` - 46 edges
4. `PrismaClient` - 20 edges
5. `BillingInfoDelegate` - 18 edges
6. `BookingDelegate` - 18 edges
7. `ConversationDelegate` - 18 edges
8. `MessageDelegate` - 18 edges
9. `PaymentDelegate` - 18 edges
10. `PaymentMethodDelegate` - 18 edges

## Surprising Connections (you probably didn't know these)
- `RootLayout()` --calls--> `createClient()`  [EXTRACTED]
  app/layout.tsx → utils/supabase/server.ts
- `BookingsPage()` --calls--> `createClient()`  [EXTRACTED]
  app/profile/bookings/page.tsx → utils/supabase/server.ts
- `SettingsPage()` --calls--> `createClient()`  [EXTRACTED]
  app/profile/settings/page.tsx → utils/supabase/server.ts
- `Badge()` --calls--> `cn()`  [EXTRACTED]
  components/host/HostBookingCard.tsx → lib/utils.ts
- `AvatarBadge()` --calls--> `cn()`  [EXTRACTED]
  components/ui/avatar.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (88 total, 40 thin omitted)

### Community 0 - "User.ts"
Cohesion: 0.01
Nodes (169): AggregateUser, BoolFieldUpdateOperationsInput, DateTimeFieldUpdateOperationsInput, EnumUserRoleFieldUpdateOperationsInput, GetUserAggregateType, GetUserGroupByPayload, NullableStringFieldUpdateOperationsInput, StringFieldUpdateOperationsInput (+161 more)

### Community 1 - "prismaNamespace.ts"
Cohesion: 0.02
Nodes (129): AnyNull, Args, At, AtLeast, AtLoose, AtStrict, BatchPayload, BillingInfoScalarFieldEnum (+121 more)

### Community 2 - "Booking.ts"
Cohesion: 0.02
Nodes (128): AggregateBooking, Booking$conversationArgs, Booking$paymentArgs, Booking$reviewArgs, BookingAggregateArgs, BookingAvgAggregateInputType, BookingAvgAggregateOutputType, BookingAvgOrderByAggregateInput (+120 more)

### Community 3 - "Space.ts"
Cohesion: 0.02
Nodes (116): AggregateSpace, EnumSpaceTypeFieldUpdateOperationsInput, GetSpaceAggregateType, GetSpaceGroupByPayload, IntFieldUpdateOperationsInput, IntNullableListFilter, NullableFloatFieldUpdateOperationsInput, Space$bookingsArgs (+108 more)

### Community 4 - "Payment.ts"
Cohesion: 0.02
Nodes (108): AggregatePayment, EnumPaymentStatusFieldUpdateOperationsInput, GetPaymentAggregateType, GetPaymentGroupByPayload, Payment$payoutArgs, PaymentAggregateArgs, PaymentAvgAggregateInputType, PaymentAvgAggregateOutputType (+100 more)

### Community 5 - "Review.ts"
Cohesion: 0.02
Nodes (106): AggregateReview, GetReviewAggregateType, GetReviewGroupByPayload, ReviewAggregateArgs, ReviewAvgAggregateInputType, ReviewAvgAggregateOutputType, ReviewAvgOrderByAggregateInput, ReviewCountAggregateInputType (+98 more)

### Community 6 - "Conversation.ts"
Cohesion: 0.02
Nodes (101): AggregateConversation, Conversation$bookingArgs, Conversation$messagesArgs, Conversation$participantsArgs, ConversationAggregateArgs, ConversationCountAggregateInputType, ConversationCountAggregateOutputType, ConversationCountArgs (+93 more)

### Community 7 - "Payout.ts"
Cohesion: 0.02
Nodes (96): AggregatePayout, EnumPayoutStatusFieldUpdateOperationsInput, GetPayoutAggregateType, GetPayoutGroupByPayload, NullableDateTimeFieldUpdateOperationsInput, Payout$paymentsArgs, PayoutAggregateArgs, PayoutAvgAggregateInputType (+88 more)

### Community 8 - "Message.ts"
Cohesion: 0.02
Nodes (88): AggregateMessage, GetMessageAggregateType, GetMessageGroupByPayload, MessageAggregateArgs, MessageCountAggregateInputType, MessageCountAggregateOutputType, MessageCountArgs, MessageCountOrderByAggregateInput (+80 more)

### Community 9 - "createClient"
Cohesion: 0.08
Nodes (38): login(), logout(), signup(), markMessagesAsReadAction(), sendMessageAction(), createReviewAction(), ReviewSchema, createSpaceAction() (+30 more)

### Community 10 - "PaymentMethod.ts"
Cohesion: 0.03
Nodes (79): AggregatePaymentMethod, GetPaymentMethodAggregateType, GetPaymentMethodGroupByPayload, PaymentMethodAggregateArgs, PaymentMethodAvgAggregateInputType, PaymentMethodAvgAggregateOutputType, PaymentMethodAvgOrderByAggregateInput, PaymentMethodCountAggregateInputType (+71 more)

### Community 11 - "BillingInfo.ts"
Cohesion: 0.03
Nodes (67): AggregateBillingInfo, BillingInfoAggregateArgs, BillingInfoCountAggregateInputType, BillingInfoCountAggregateOutputType, BillingInfoCountArgs, BillingInfoCountOrderByAggregateInput, BillingInfoCreateArgs, BillingInfoCreateInput (+59 more)

### Community 12 - "commonInputTypes.ts"
Cohesion: 0.04
Nodes (54): BoolFilter, BoolWithAggregatesFilter, DateTimeFilter, DateTimeNullableFilter, DateTimeNullableWithAggregatesFilter, DateTimeWithAggregatesFilter, EnumBookingStatusFilter, EnumBookingStatusWithAggregatesFilter (+46 more)

### Community 13 - "HostCreateSpaceForm.tsx"
Cohesion: 0.16
Nodes (26): SearchParams, SearchParams, timeOptions, Props, timeOptions, Checkbox(), Field(), FieldDescription() (+18 more)

### Community 14 - "cn"
Cohesion: 0.12
Nodes (23): HostReviewsPage(), HeroSearchForm(), Badge(), badgeVariants, Card(), CardAction(), CardContent(), CardDescription() (+15 more)

### Community 15 - "BookingCardClient.tsx"
Cohesion: 0.05
Nodes (59): getOrCreateConversationAction(), deleteSpaceAction(), Badge(), HostBookingCard(), HostSpaceDropdown(), useMediaQuery(), BookingCardClient(), formatSpaceType() (+51 more)

### Community 16 - "prismaNamespaceBrowser.ts"
Cohesion: 0.06
Nodes (31): BillingInfo, Booking, Conversation, $Enums, Message, Payment, PaymentMethod, Payout (+23 more)

### Community 17 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native AGENTS.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 18 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 19 - "PrismaClient"
Cohesion: 0.07
Nodes (4): config, LogOptions, PrismaClient, PrismaClientConstructor

### Community 20 - "devDependencies"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, jiti, devDependencies, eslint, eslint-config-next, jiti, prisma (+17 more)

### Community 21 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 22 - "button.tsx"
Cohesion: 0.11
Nodes (21): updateNotificationsAction(), BookingsPage(), SettingsPage(), NotificationForm(), NotificationFormProps, ProfileForm(), ProfileFormProps, BookingData (+13 more)

### Community 23 - "dependencies"
Cohesion: 0.08
Nodes (25): class-variance-authority, clsx, lucide-react, dependencies, class-variance-authority, clsx, lucide-react, pg (+17 more)

### Community 24 - "mock-data.ts"
Cohesion: 0.10
Nodes (17): Booking, BookingStatus, mockBookings, mockPaymentMethods, mockPayments, mockReviews, mockSpaces, mockUsers (+9 more)

### Community 25 - "SpaceDetailClient.tsx"
Cohesion: 0.08
Nodes (28): checkAvailability(), Props, SearchClient(), SpaceData, Props, SearchMobileHeader(), SearchMobileSheet(), SearchResults() (+20 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 37 - "host/bookings/page.tsx"
Cohesion: 0.26
Nodes (6): updatePasswordAction(), getStatusColor(), getStatusLabel(), HostBookingsPage(), UpdatePasswordForm(), Input()

### Community 39 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 40 - "prisma/client.ts"
Cohesion: 0.15
Nodes (12): BillingInfo, Booking, Conversation, $Enums, Message, Payment, PaymentMethod, Payout (+4 more)

### Community 41 - "enums.ts"
Cohesion: 0.27
Nodes (7): BookingStatus, PaymentStatus, PayoutStatus, UserRole, adapter, pool, prisma

### Community 42 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, graphify, graphify:full, lint, postinstall, start (+1 more)

### Community 43 - "layout.tsx"
Cohesion: 0.28
Nodes (6): inter, metadata, RootLayout(), Footer(), Navbar(), Toaster()

### Community 51 - "CheckoutClient.tsx"
Cohesion: 0.18
Nodes (11): BookingData, createBookingAction(), updateBookingStatus(), Props, CheckoutClient(), formatSpaceType(), BookingActions(), BookingActionsProps (+3 more)

### Community 52 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 55 - "middleware.ts"
Cohesion: 0.60
Nodes (3): config, middleware(), updateSession()

### Community 58 - "package.json"
Cohesion: 0.29
Nodes (6): name, overrides, deepmerge-ts, mysql2, private, version

### Community 63 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 65 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 68 - "CoW - Coworking App"
Cohesion: 0.40
Nodes (4): CoW - Coworking App, Local Development, Tech Stack, Workflows

### Community 71 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 72 - "graphify reference: commit hook and native AGENTS.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native AGENTS.md integration, graphify reference: commit hook and native AGENTS.md integration

### Community 73 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 74 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 75 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 76 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 81 - "PrismaClientBaseOptions"
Cohesion: 0.67
Nodes (3): PrismaClientBaseOptions, PrismaClientOptionsWithAccelerateUrl, PrismaClientOptionsWithAdapter

## Knowledge Gaps
- **1516 isolated node(s):** `BookingData`, `ReviewSchema`, `CreateSpaceSchema`, `UpdateProfileSchema`, `Props` (+1511 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1825 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `host/bookings/page.tsx`, `createClient`, `HostCreateSpaceForm.tsx`, `BookingCardClient.tsx`, `CheckoutClient.tsx`, `button.tsx`, `SpaceDetailClient.tsx`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `ReviewDelegate` connect `ReviewDelegate` to `Review.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `BookingStatus` connect `enums.ts` to `CheckoutClient.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `BookingData`, `ReviewSchema`, `CreateSpaceSchema` to the rest of the system?**
  _1516 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `User.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.011764705882352941 - nodes in this community are weakly interconnected._
- **Should `prismaNamespace.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.015384615384615385 - nodes in this community are weakly interconnected._
- **Should `Booking.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.015503875968992248 - nodes in this community are weakly interconnected._