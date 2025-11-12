# VetOne.AI Pricing Strategy
**Date:** November 12, 2025
**Exchange Rate:** 1 USD = 5.27 BRL

---

## 💰 Cost Structure (USD)

### Variable Costs (Per Consultation)

| Service | Cost (USD) | Cost (BRL) | Notes |
|---------|------------|------------|-------|
| **Deepgram Nova-3** | $0.0215 | R$ 0.11 | 5 min × $0.0043/min |
| **Groq Llama 3.3 70B** | $0.0050 | R$ 0.03 | ~3.5k tokens total |
| **Perplexity API** | $0.0002 | R$ 0.001 | 20% usage rate |
| **TOTAL PER CONSULTATION** | **$0.0267** | **R$ 0.14** | |

### Fixed Costs (Monthly)

| Service | Cost (USD) | Cost (BRL) | Notes |
|---------|------------|------------|-------|
| **Vercel Pro** | $20.00 | R$ 105.40 | Production hosting |
| **Supabase Pro** | $25.00 | R$ 131.75 | 8GB + Auth + Storage |
| **TOTAL MONTHLY** | **$45.00** | **R$ 237.15** | |

---

## 💎 Pricing Plans

### Plan Structure

| Plan | USD/month | BRL/month | Credits | Cost/Credit (USD) | Cost/Credit (BRL) |
|------|-----------|-----------|---------|-------------------|-------------------|
| **Iniciante** | $0 | R$ 0 | 20 | Free | Free |
| **Profissional** | $19 | R$ 99 | 100 | $0.19 | R$ 0.99 |
| **Clínica** | $15/vet | R$ 79/vet | 150/vet | $0.10 | R$ 0.53 |

### Extra Credits

| Plan | USD/credit | BRL/credit |
|------|------------|------------|
| **Professional** | $0.38 | R$ 1.99 |
| **Clinic** | $0.28 | R$ 1.49 |

---

## 📊 Profitability Analysis

### Gross Margins

**Professional Plan:**
- Revenue per credit: $0.19 USD
- Cost per credit: $0.0267 USD
- Gross profit: $0.1633 USD
- **Margin: 712%**

**Clinic Plan:**
- Revenue per credit: $0.10 USD
- Cost per credit: $0.0267 USD
- Gross profit: $0.0733 USD
- **Margin: 375%**

### Break-Even Analysis

**Fixed Costs:** $45/month

**Professional Plan ($19/month):**
- Need ~2.37 paying customers to cover fixed costs
- At 100 credits/customer: $16.33 profit per customer
- **Break-even: 3 customers**

**Clinic Plan ($15/vet, min 3 vets = $45):**
- 1 clinic = covers fixed costs exactly
- **Break-even: 1 clinic**

### Unit Economics

**Professional Customer (100 credits/month):**
- Revenue: $19.00
- Variable costs: $2.67 (100 × $0.0267)
- Contribution margin: $16.33
- **Contribution margin %: 86%**

**Clinic Customer (3 vets × 150 credits = 450 credits):**
- Revenue: $45.00 (3 × $15)
- Variable costs: $12.02 (450 × $0.0267)
- Contribution margin: $32.98
- **Contribution margin %: 73%**

---

## 🎯 Pricing Psychology

### Value Proposition

**Iniciante (Free):**
- Value if purchased: R$ 50 (20 × R$ 2.50)
- Actual cost to us: R$ 2.80 (20 × R$ 0.14)
- **Loss leader strategy: R$ 2.80/month cost**

**Profissional:**
- Value if purchased individually: R$ 250 (100 × R$ 2.50)
- Customer pays: R$ 99
- **Perceived savings: R$ 151 (60% discount)**

**Clínica:**
- Value if purchased individually: R$ 375 (150 × R$ 2.50)
- Customer pays: R$ 79
- **Perceived savings: R$ 296 (79% discount)**

---

## 📈 Revenue Projections

### Scenario 1: Conservative (100 customers first year)

| Plan | Customers | MRR (USD) | MRR (BRL) | ARR (BRL) |
|------|-----------|-----------|-----------|-----------|
| Free | 50 | $0 | R$ 0 | R$ 0 |
| Professional | 40 | $760 | R$ 4,005 | R$ 48,060 |
| Clinic (3 vets) | 10 | $450 | R$ 2,372 | R$ 28,458 |
| **TOTAL** | **100** | **$1,210** | **R$ 6,377** | **R$ 76,518** |

**Costs:**
- Fixed: $45/month = R$ 237/month = R$ 2,844/year
- Variable: (50×0 + 40×100 + 10×450) × $0.0267 × 12 = $3,208/year = R$ 16,906/year
- **Total costs: R$ 19,750/year**
- **Profit: R$ 56,768/year (74% margin)**

### Scenario 2: Growth (500 customers)

| Plan | Customers | MRR (USD) | MRR (BRL) | ARR (BRL) |
|------|-----------|-----------|-----------|-----------|
| Free | 200 | $0 | R$ 0 | R$ 0 |
| Professional | 250 | $4,750 | R$ 25,033 | R$ 300,390 |
| Clinic (3 vets) | 50 | $2,250 | R$ 11,858 | R$ 142,290 |
| **TOTAL** | **500** | **$7,000** | **R$ 36,890** | **R$ 442,680** |

**Costs:**
- Fixed: R$ 2,844/year
- Variable: R$ 84,528/year
- **Total costs: R$ 87,372/year**
- **Profit: R$ 355,308/year (80% margin)**

---

## 🔄 Currency Risk Management

### Current Strategy
- Prices set in USD: $0, $19, $15
- Converted to BRL at: 5.27
- Review frequency: Monthly

### Risk Mitigation
1. **Price in USD:** All internal calculations in USD
2. **Monthly review:** Adjust BRL prices if USD/BRL changes > 5%
3. **30-day notice:** Communicate price changes to customers
4. **Annual contracts:** Lock in BRL rate for 12 months (Clinic/Enterprise)

### Exchange Rate Scenarios

| USD/BRL Rate | Professional BRL | Clinic BRL | Change |
|--------------|------------------|------------|--------|
| 4.50 (strong) | R$ 85.50 | R$ 67.50 | -14% |
| 5.27 (current) | R$ 99.00 | R$ 79.00 | 0% |
| 6.00 (weak) | R$ 114.00 | R$ 90.00 | +15% |

---

## 💡 Recommendations

### Short-term (0-3 months)
1. ✅ Implement credit-based pricing
2. ✅ Create transparent pricing page
3. ⚠️ Set up Stripe with USD pricing
4. ⚠️ Build credit tracking system in Supabase
5. ⚠️ Monitor usage patterns (free users → paid conversion)

### Mid-term (3-6 months)
1. Analyze actual API costs vs projections
2. Implement credit rollover for paid plans
3. A/B test pricing tiers
4. Add referral program (bonus credits)
5. Introduce annual plans (15% discount)

### Long-term (6-12 months)
1. Consider volume discounts for large clinics
2. Explore international expansion (USD pricing already set)
3. Premium add-ons (white-label, API access)
4. Enterprise custom pricing (negotiated)

---

## 📋 Credit System Implementation

### Technical Requirements

**Database Schema (Supabase):**
```sql
-- Credits table
CREATE TABLE user_credits (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan_type VARCHAR(50),
  total_credits INTEGER,
  used_credits INTEGER DEFAULT 0,
  bonus_credits INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP -- NULL for paid plans
);

-- Credit transactions
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount INTEGER,
  type VARCHAR(50), -- 'purchase', 'usage', 'refund', 'bonus'
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Usage Tracking

**When to deduct a credit:**
1. User clicks "Generate AI Diagnosis" button
2. User clicks "Generate SOAP Note" button
3. User requests drug interaction check
4. User accesses research assistant (PubMed)

**Free features (no credit):**
- Voice transcription
- Manual SOAP notes
- Patient management
- Calendar/agenda
- Basic prescriptions

---

## 🎁 Promotional Strategies

### Launch Offers
1. **Early adopters:** First 100 customers get 50 bonus credits
2. **Referral program:** Refer a vet, both get 20 credits
3. **Clinic bundle:** 5+ vets get 10% off (R$ 71/vet)

### Seasonal
1. **Black Friday:** 50% off first 3 months
2. **New Year:** Double credits for January
3. **Vet conferences:** Special codes for attendees

---

## 📞 Support & Monitoring

### Metrics to Track
1. **Conversion rate:** Free → Professional
2. **Credit usage:** Average per user/month
3. **Churn rate:** By plan tier
4. **Support tickets:** Credit-related issues
5. **Overage purchases:** Extra credits bought

### Alerts
- User reaches 90% of credits → suggest upgrade
- Unusual usage patterns → fraud detection
- API costs spike → investigate
- Exchange rate changes > 5% → review pricing

---

## Summary

**Pricing Model:** Credit-based, USD pricing converted to BRL
**Key Strength:** High margins (73-86%), scalable infrastructure
**Key Risk:** Currency fluctuation (mitigated by monthly reviews)
**Competitive Advantage:** Transparent, usage-based pricing

**Next Steps:**
1. Implement Stripe integration (USD)
2. Build credit tracking system
3. Set up automated usage monitoring
4. Launch with current pricing structure

