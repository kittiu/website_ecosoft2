---
title: "Deposit Invoicing for ERPNext"
date: 2025-04-14
author: "Kitti U."
category: "Accounting"
description: "How Ecosoft's Deposit Invoicing solution solves the Thai tax compliance problem with advance payments in ERPNext — with a practical worked example."
image: "/images/blog/erpnext-deposit-invoice.png"
tags: ["erpnext", "accounting", "thai-tax", "deposit"]
---

Thai business practices commonly involve advance deposits (เงินมัดจำ) — a customer pays a percentage upfront before goods are delivered. ERPNext supports advance payments natively, but with a tax compliance gap that matters in Thailand.

## The Problem with Standard Advance Payments

ERPNext's existing advance payment feature allows prepayment without issuing an invoice. In Thailand, this creates a compliance issue: **advance payments must correspond to proper tax invoices**.

The Revenue Department requires that when a deposit is received, a tax invoice is issued at that moment — not deferred until final delivery. Standard ERPNext does not handle this correctly out of the box.

## The Deposit Invoicing Solution

Ecosoft's Deposit Invoicing module closes this gap by:

1. **Creating separate deposit invoices** that properly record tax obligations when payments are received
2. **Applying credits proportionally** to subsequent invoices as goods are delivered in installments
3. **Supporting both purchase and sales cycles** with the same mechanism

## System Setup

Three configuration steps are required:

1. **Mark items as deposit items** in the Item master
2. **Configure default accounting accounts** for deposit transactions (deferred revenue / advance receipts)
3. **Enable negative rates in sales settings** to handle deposit deductions on subsequent invoices

## Practical Example: 10-Computer Purchase

A customer orders 10 computers at 10,000 THB each (100,000 THB + 7% VAT = 107,000 THB total).

| Step | Amount | Tax Invoice |
|---|---|---|
| 30% deposit received | 30,000 THB + VAT | Issued immediately |
| Delivery 1 (5 computers) | 50,000 THB − 15,000 deposit credit | Issued on delivery |
| Delivery 2 (5 computers) | 50,000 THB − 15,000 deposit credit | Issued on delivery |
| **Total** | **107,000 THB** | Fully reconciled |

The deposit is correctly deducted across installment invoices, with proper tax allocation at each stage.

## Key Features

- Supports included and excluded VAT scenarios
- Flexible deposit percentage calculations
- Multi-order invoice consolidation
- Full audit trail from deposit to final settlement

The module is available as an open-source contribution — consistent with Ecosoft's commitment to the OCA community and the principle that Thai businesses should own their compliance tools, not pay for them perpetually.
