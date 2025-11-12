# VetOne.AI Credit System
**Last Updated:** November 12, 2025

---

## Overview

VetOne.AI uses a **simple credit-based pricing model** where users purchase monthly credits that are automatically deducted as they use the platform. This document explains how the credit system works internally for development and business purposes.

---

## Credit Usage Rules

### Simple Principle
**1 Credit = Any use of the VetOne.AI platform**

When a user interacts with VetOne.AI features, credits are automatically deducted from their account balance. The system tracks usage in real-time and displays the current credit balance in the application.

### When Credits Are Deducted

Credits are deducted whenever users utilize VetOne.AI features, regardless of which specific functionality they access. The platform treats all usage equally - whether transcribing, generating diagnoses, creating SOAP notes, or any other feature.

**Key Points:**
- Credits deduct automatically during platform usage
- All features consume credits
- Users can monitor their credit balance in real-time via the app
- No manual credit allocation or feature-specific tracking required

---

## Credit Plans

### Plan Structure

| Plan | Monthly Price | Credits Included | Credit Cost | Extra Credit Price |
|------|--------------|------------------|-------------|--------------------|
| **Iniciante** | R$ 0 (Free) | 20 | Free | Not available |
| **Profissional** | R$ 99 ($19 USD) | 100 | R$ 0.99 | R$ 1.99 each |
| **Clínica** | R$ 79/vet ($15 USD) | 150/vet | R$ 0.53 | R$ 1.49 each |

### Plan Details

**Iniciante (Starter) - Free**
- 20 credits per month
- Credits reset monthly (do not roll over)
- No extra credits available for purchase
- Perfect for trying VetOne.AI
- Includes all basic features

**Profissional (Professional) - R$ 99/month**
- 100 credits per month
- Credits never expire
- Extra credits: R$ 1.99 each
- Best for individual veterinarians
- All features included
- Priority support

**Clínica (Clinic) - R$ 79/vet/month**
- 150 credits per vet per month
- Minimum 3 veterinarians (R$ 237/month total)
- Credits never expire
- Extra credits: R$ 1.49 each (bulk discount)
- Multi-user collaboration
- Shared database
- Clinic analytics dashboard
- Dedicated account manager

---

## Credit Lifecycle

### Credit Allocation
1. **New Subscriber**: Credits allocated immediately upon plan activation
2. **Monthly Renewal**: Credits automatically added on billing cycle date
3. **Plan Upgrade**: Prorated credits added immediately
4. **Plan Downgrade**: Takes effect at next billing cycle

### Credit Expiration
- **Free Plan (Iniciante)**: Credits expire at end of month, reset to 20
- **Paid Plans (Profissional/Clínica)**: Credits never expire
- **Extra Purchased Credits**: Never expire on paid plans

### Credit Purchasing
- Available only on **Profissional** and **Clínica** plans
- Can be purchased at any time via the app
- Added immediately to account balance
- No expiration date

---

## Technical Implementation

### Database Schema (Supabase)

```sql
-- User Credits Table
CREATE TABLE user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type VARCHAR(50) NOT NULL, -- 'starter', 'professional', 'clinic'
  total_credits INTEGER NOT NULL DEFAULT 0,
  used_credits INTEGER NOT NULL DEFAULT 0,
  remaining_credits INTEGER GENERATED ALWAYS AS (total_credits - used_credits) STORED,
  bonus_credits INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  billing_cycle_start DATE NOT NULL,
  billing_cycle_end DATE NOT NULL
);

-- Credit Transaction Log
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Positive for additions, negative for deductions
  transaction_type VARCHAR(50) NOT NULL, -- 'allocation', 'usage', 'purchase', 'refund', 'bonus'
  description TEXT,
  metadata JSONB, -- Store additional context (feature used, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
```

### Credit Deduction Flow

```typescript
// Example: Credit deduction function
async function deductCredit(userId: string, description: string, metadata?: object) {
  // 1. Check user has credits available
  const { data: userCredits, error } = await supabase
    .from('user_credits')
    .select('remaining_credits, plan_type')
    .eq('user_id', userId)
    .single();

  if (error || !userCredits) {
    throw new Error('Unable to fetch user credits');
  }

  if (userCredits.remaining_credits < 1) {
    throw new Error('Insufficient credits. Please purchase more or upgrade your plan.');
  }

  // 2. Deduct credit
  const { error: updateError } = await supabase
    .from('user_credits')
    .update({
      used_credits: supabase.sql`used_credits + 1`,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (updateError) {
    throw new Error('Failed to deduct credit');
  }

  // 3. Log transaction
  await supabase
    .from('credit_transactions')
    .insert({
      user_id: userId,
      amount: -1,
      transaction_type: 'usage',
      description: description,
      metadata: metadata || {}
    });

  // 4. Check if user is low on credits (optional notification)
  if (userCredits.remaining_credits - 1 <= 10) {
    await sendLowCreditNotification(userId, userCredits.remaining_credits - 1);
  }

  return { success: true, remaining: userCredits.remaining_credits - 1 };
}
```

### Usage Tracking

The system automatically tracks when users interact with VetOne.AI. Each interaction triggers the credit deduction flow:

```typescript
// Example usage in API endpoint
app.post('/api/use-feature', async (req, res) => {
  try {
    const userId = req.user.id;

    // Deduct credit
    const result = await deductCredit(
      userId,
      'Platform usage',
      {
        timestamp: new Date(),
        session_id: req.sessionId
      }
    );

    // Proceed with feature execution
    const featureResult = await executeFeature(req.body);

    res.json({
      success: true,
      remaining_credits: result.remaining,
      result: featureResult
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

---

## User-Facing Communication

### In-App Credit Display

Users should always see their credit balance prominently displayed:

```typescript
// Example UI component
<CreditBalance>
  <Icon>💎</Icon>
  <Count>{remainingCredits}</Count>
  <Label>créditos restantes</Label>
  {remainingCredits <= 10 && (
    <LowBalanceWarning>
      Seus créditos estão acabando.
      <Link to="/purchase">Comprar mais</Link>
    </LowBalanceWarning>
  )}
</CreditBalance>
```

### Low Credit Notifications

**At 90% usage (10 credits remaining for Professional plan):**
```
"Você tem apenas 10 créditos restantes.
Compre créditos adicionais ou seu plano renovará em [X] dias."
```

**At 100% usage (0 credits):**
```
"Seus créditos acabaram!
Compre créditos extras por R$ [price] ou aguarde até [renewal_date] para renovação automática."
```

---

## Pricing Rationale

### Cost Structure

**Per-Usage Cost (USD):**
- Deepgram Nova-3 transcription: $0.0215 per consultation (5 min × $0.0043/min)
- Groq Llama 3.3 70B inference: $0.0050 per consultation
- Perplexity API searches: $0.0002 per consultation (20% usage rate)
- **Total variable cost: $0.0267 USD per consultation** (≈ R$ 0.14)

**Fixed Costs (Monthly):**
- Vercel Pro hosting: $20/month
- Supabase Pro database: $25/month
- **Total fixed: $45/month** (≈ R$ 237)

### Margin Analysis

**Professional Plan:**
- Price per credit: R$ 0.99 ($0.19 USD)
- Cost per credit: R$ 0.14 ($0.0267 USD)
- Gross margin: **86%**

**Clinic Plan:**
- Price per credit: R$ 0.53 ($0.10 USD)
- Cost per credit: R$ 0.14 ($0.0267 USD)
- Gross margin: **73%**

**Break-Even:**
- Fixed costs: $45/month
- Need **3 Professional customers** OR **1 Clinic (3 vets)** to break even

---

## Business Rules

### Credit Purchasing Rules
1. Extra credits only available on paid plans
2. Minimum purchase: 1 credit
3. No maximum purchase limit
4. Instant credit delivery
5. Extra credits use same expiration rules as plan credits

### Refund Policy
- Unused credits on paid plans: No expiration, no refunds needed
- Downgrade/cancellation: Credits remain until used or account closed
- Account closure: Pro-rated refund of unused credits purchased in last 30 days

### Promotional Credits
- Referral bonus: 20 credits for both referrer and referee
- Early adopter bonus: 50 credits (first 100 customers)
- Seasonal promotions: As defined per campaign

---

## Monitoring & Analytics

### Key Metrics to Track

1. **Credit Usage Rate**
   - Average credits used per user per month
   - By plan type
   - By user cohort (new vs returning)

2. **Conversion Metrics**
   - Free → Paid conversion rate
   - Average credits used before conversion
   - Time to first paid plan

3. **Revenue Metrics**
   - MRR from subscriptions
   - Revenue from extra credit purchases
   - Average revenue per user (ARPU)

4. **User Behavior**
   - Features used per credit deduction
   - Peak usage times
   - Credit exhaustion patterns

### Alerts
- User reaches 90% credit usage
- User exhausts all credits
- Unusual usage patterns (potential abuse)
- Failed credit purchases
- API costs exceed projections

---

## Future Enhancements

### Potential Features
1. **Credit Rollover Limit**: Cap rollover at 2× monthly allocation
2. **Credit Sharing**: Allow clinic accounts to reallocate credits between vets
3. **Usage Analytics**: Detailed breakdown of credit usage by feature
4. **Auto-purchase**: Automatically buy credits when balance is low
5. **Annual Plans**: 15% discount + upfront credit allocation
6. **Enterprise Plans**: Custom credit pools with volume discounts

---

## Support & Edge Cases

### Common Scenarios

**User runs out of credits mid-consultation:**
- Allow completion of current operation
- Block new operations until credits purchased or renewed
- Show prominent "buy credits" CTA

**User downgrades plan:**
- Keep existing credit balance
- New monthly allocation uses downgraded plan amount
- Inform user they can still use existing credits

**User upgrades plan:**
- Immediate access to new credit allocation
- Pro-rated credit addition based on days remaining in cycle

**Billing failure:**
- Grace period: 3 days
- Credits freeze after grace period
- Account reactivates upon successful payment

---

## Currency Management

**Pricing Strategy:**
- All prices set in **USD**
- Converted to **BRL** at current rate (1 USD = 5.27 BRL as of Nov 2025)
- Monthly exchange rate review
- 30-day notice for BRL price adjustments if USD/BRL changes >5%

**Display:**
- Show BRL prices to Brazilian customers
- Note: "Preços calculados em USD e convertidos para BRL"
- Stripe handles payment in user's local currency

---

## Documentation

**User-Facing:**
- Pricing page: [pricing.html](pricing.html)
- FAQ section includes credit system explanation
- In-app tooltips and help modals

**Internal:**
- This document: Credit system specification
- [PRICING_STRATEGY.md](PRICING_STRATEGY.md): Detailed pricing analysis
- API documentation: Credit endpoints
- Database schema: See Technical Implementation section above

---

## Contact

For questions about the credit system implementation, contact:
- **Development**: development@vetone.ai
- **Business/Pricing**: patricia@vetone.ai

---

**Version:** 1.0
**Last Review:** November 12, 2025
**Next Review:** December 12, 2025
