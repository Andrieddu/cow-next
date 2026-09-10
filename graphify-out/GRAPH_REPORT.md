# Graph Report - cow-next  (2026-09-04)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2090 nodes · 2930 edges · 71 communities (36 shown, 34 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f4438b96`
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
- Navbar.tsx
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
- dropdown-menu.tsx
- host/bookings/page.tsx
- Prisma__UserClient
- SearchClient.tsx
- prisma/client.ts
- enums.ts
- scripts
- space-actions.ts
- Prisma__BookingClient
- Prisma__ConversationClient
- Prisma__PaymentClient
- Prisma__ReviewClient
- Prisma__SpaceClient
- Prisma__MessageClient
- Prisma__PayoutClient
- checkout/page.tsx
- SpaceCard.tsx
- Prisma__BillingInfoClient
- Prisma__PaymentMethodClient
- middleware.ts
- date-fns
- eslint.config.mjs
- lucide-react
- next
- next.config.ts
- next-themes
- @prisma/adapter-pg
- radix-ui
- react
- shadcn
- tailwind-merge
- vaul
- zod
- postcss.config.mjs

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
- `Badge()` --calls--> `cn()`  [EXTRACTED]
  components/host/HostBookingCard.tsx → lib/utils.ts
- `AvatarBadge()` --calls--> `cn()`  [EXTRACTED]
  components/ui/avatar.tsx → lib/utils.ts
- `AvatarGroup()` --calls--> `cn()`  [EXTRACTED]
  components/ui/avatar.tsx → lib/utils.ts
- `AvatarGroupCount()` --calls--> `cn()`  [EXTRACTED]
  components/ui/avatar.tsx → lib/utils.ts
- `CalendarDayButton()` --calls--> `cn()`  [EXTRACTED]
  components/ui/calendar.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (71 total, 34 thin omitted)

### Community 0 - "User.ts"
Cohesion: 0.01
Nodes (169): AggregateUser, BoolFieldUpdateOperationsInput, DateTimeFieldUpdateOperationsInput, EnumUserRoleFieldUpdateOperationsInput, GetUserAggregateType, GetUserGroupByPayload, NullableStringFieldUpdateOperationsInput, StringFieldUpdateOperationsInput (+161 more)

### Community 1 - "prismaNamespace.ts"
Cohesion: 0.02
Nodes (128): AnyNull, Args, At, AtLeast, AtLoose, AtStrict, BatchPayload, BillingInfoScalarFieldEnum (+120 more)

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
Cohesion: 0.05
Nodes (59): login(), logout(), signup(), updatePasswordAction(), BookingData, checkAvailability(), createBookingAction(), updateBookingStatus() (+51 more)

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
Cohesion: 0.13
Nodes (31): createSpaceAction(), updateSpaceAction(), SearchParams, SearchParams, ProfileFormProps, timeOptions, HostCreateSpaceForm(), EditSpaceForm() (+23 more)

### Community 14 - "cn"
Cohesion: 0.10
Nodes (28): HostReviewsPage(), Badge(), badgeVariants, Card(), CardAction(), CardContent(), CardDescription(), CardFooter() (+20 more)

### Community 15 - "BookingCardClient.tsx"
Cohesion: 0.15
Nodes (24): deleteSpaceAction(), HostSpaceDropdown(), useMediaQuery(), BookingCardClient(), formatSpaceType(), formatStatus(), getStatusColor(), useMediaQuery() (+16 more)

### Community 16 - "prismaNamespaceBrowser.ts"
Cohesion: 0.06
Nodes (31): BillingInfo, Booking, Conversation, $Enums, Message, Payment, PaymentMethod, Payout (+23 more)

### Community 17 - "Navbar.tsx"
Cohesion: 0.14
Nodes (21): getOrCreateConversationAction(), Badge(), HostBookingCard(), SearchMobileSheetProps, SidebarProps, getAmenityIcon(), SpaceInfo(), Avatar() (+13 more)

### Community 18 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 19 - "PrismaClient"
Cohesion: 0.07
Nodes (4): config, LogOptions, PrismaClient, PrismaClientConstructor

### Community 20 - "devDependencies"
Cohesion: 0.09
Nodes (23): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss (+15 more)

### Community 21 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 22 - "button.tsx"
Cohesion: 0.16
Nodes (8): FeaturesSection(), QuickExplore(), BookingData, CancelBookingButtonProps, Button(), buttonVariants, Calendar(), CalendarDayButton()

### Community 23 - "dependencies"
Cohesion: 0.10
Nodes (21): class-variance-authority, clsx, dependencies, class-variance-authority, clsx, pg, @prisma/client, react-day-picker (+13 more)

### Community 24 - "mock-data.ts"
Cohesion: 0.10
Nodes (17): Booking, BookingStatus, mockBookings, mockPaymentMethods, mockPayments, mockReviews, mockSpaces, mockUsers (+9 more)

### Community 25 - "SpaceDetailClient.tsx"
Cohesion: 0.19
Nodes (14): HeroSearchForm(), BookingModals(), BookingWidget(), Props, SpaceDetailClient(), SpaceDetailData, useMediaQuery(), SpaceGallery() (+6 more)

### Community 36 - "dropdown-menu.tsx"
Cohesion: 0.15
Nodes (11): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+3 more)

### Community 37 - "host/bookings/page.tsx"
Cohesion: 0.22
Nodes (4): getStatusColor(), getStatusLabel(), HostBookingsPage(), Separator()

### Community 39 - "SearchClient.tsx"
Cohesion: 0.20
Nodes (9): SearchClient(), Props, SearchMobileHeader(), SearchMobileSheet(), SearchResults(), amenitiesFilter, Props, SearchSidebar() (+1 more)

### Community 40 - "prisma/client.ts"
Cohesion: 0.17
Nodes (11): BillingInfo, Booking, Conversation, $Enums, Message, Payment, PaymentMethod, Payout (+3 more)

### Community 41 - "enums.ts"
Cohesion: 0.24
Nodes (8): PrismaClient, BookingStatus, PaymentStatus, PayoutStatus, UserRole, adapter, pool, prisma

### Community 42 - "scripts"
Cohesion: 0.18
Nodes (10): name, private, scripts, build, dev, lint, postinstall, start (+2 more)

### Community 43 - "space-actions.ts"
Cohesion: 0.29
Nodes (4): CreateSpaceSchema, Props, SpaceType, SpaceService

### Community 51 - "checkout/page.tsx"
Cohesion: 0.40
Nodes (3): Props, CheckoutClient(), formatSpaceType()

### Community 52 - "SpaceCard.tsx"
Cohesion: 0.60
Nodes (4): SpaceData, formatSpaceType(), Props, SpaceCard()

### Community 55 - "middleware.ts"
Cohesion: 0.60
Nodes (3): config, middleware(), updateSession()

## Knowledge Gaps
- **1424 isolated node(s):** `AggregateUser`, `BoolFieldUpdateOperationsInput`, `DateTimeFieldUpdateOperationsInput`, `EnumUserRoleFieldUpdateOperationsInput`, `GetUserAggregateType` (+1419 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1713 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PaymentDelegate` connect `PaymentDelegate` to `Payment.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `Prisma__PayoutClient` connect `Prisma__PayoutClient` to `Payout.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `BookingStatus` connect `enums.ts` to `createClient`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `AggregateUser`, `BoolFieldUpdateOperationsInput`, `DateTimeFieldUpdateOperationsInput` to the rest of the system?**
  _1424 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `User.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.011764705882352941 - nodes in this community are weakly interconnected._
- **Should `prismaNamespace.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.015503875968992248 - nodes in this community are weakly interconnected._
- **Should `Booking.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.015503875968992248 - nodes in this community are weakly interconnected._