# Hartă bază de date CRM (Supabase / PostgREST)

Generat: `2026-03-27T09:20:24.576Z`
Endpoint: `https://ubcjrcuydqmixmpzooam.supabase.co/rest/v1/` (GET; `apikey` în query + headere `apikey` / `Authorization: Bearer` — cheia **nu** se pune în acest fișier).

> Dacă lista de tabele e goală: verifică că `CRM_SUPABASE_URL` și `CRM_SUPABASE_SERVICE_ROLE_KEY` sunt din **același** proiect Supabase CRM și că tabelele sunt în schema `public` expusă la API.

**API:** standard public schema (v14.4)

## Tabele (resurse din OpenAPI)

- **appointments**
- **campaign_logs**
- **campaigns**
- **client_activities**
- **client_tasks**
- **clients**
- **company_settings**
- **contracts**
- **invoices**
- **leads**
- **logs**
- **offers**
- **products**
- **proformas**
- **reports**
- **settings**
- **users**
- **verbal_processes**

---

## appointments

| Nume coloană | Tip de date | Format | Obligatoriu (NOT NULL) |
| --- | --- | --- | --- |
| `client_id` | integer | integer | Nu |
| `date_time` | integer | bigint | Nu |
| `id` | integer | integer | Da (NOT NULL) |
| `notes` | string | text | Nu |
| `reminder_sent` | integer | integer | Nu |
| `title` | string | text | Nu |

## campaign_logs

| Nume coloană | Tip de date | Format | Obligatoriu (NOT NULL) |
| --- | --- | --- | --- |
| `campaign_id` | integer | integer | Nu |
| `client_id` | integer | integer | Nu |
| `id` | integer | integer | Da (NOT NULL) |
| `status` | string | text | Nu |
| `timestamp` | integer | bigint | Nu |

## campaigns

| Nume coloană | Tip de date | Format | Obligatoriu (NOT NULL) |
| --- | --- | --- | --- |
| `background_gradient` | string | text | Nu |
| `date` | integer | bigint | Nu |
| `footer` | string | text | Nu |
| `header` | string | text | Nu |
| `id` | integer | integer | Da (NOT NULL) |
| `image_paths_json` | string | text | Nu |
| `message` | string | text | Nu |
| `product_ids_json` | string | text | Nu |
| `status` | string | text | Nu |
| `title` | string | text | Da (NOT NULL) |
| `type` | string | text | Nu |

## client_activities

| Nume coloană | Tip de date | Format | Obligatoriu (NOT NULL) |
| --- | --- | --- | --- |
| `client_id` | integer | integer | Nu |
| `date` | integer | bigint | Nu |
| `description` | string | text | Nu |
| `document_id` | integer | integer | Nu |
| `document_type` | string | text | Nu |
| `id` | integer | integer | Da (NOT NULL) |
| `title` | string | text | Nu |
| `type` | string | text | Da (NOT NULL) |

## client_tasks

| Nume coloană | Tip de date | Format | Obligatoriu (NOT NULL) |
| --- | --- | --- | --- |
| `client_id` | integer | integer | Nu |
| `description` | string | text | Nu |
| `due_date` | string | text | Da (NOT NULL) |
| `id` | integer | integer | Da (NOT NULL) |
| `is_completed` | integer | integer | Nu |
| `resolution` | string | text | Nu |
| `status` | string | text | Nu |
| `title` | string | text | Da (NOT NULL) |

## clients

| Nume coloană | Tip de date | Format | Obligatoriu (NOT NULL) |
| --- | --- | --- | --- |
| `address` | string | text | Nu |
| `apartment` | string | text | Nu |
| `bank` | string | text | Nu |
| `building` | string | text | Nu |
| `cif` | string | text | Nu |
| `city` | string | text | Nu |
| `county` | string | text | Nu |
| `email` | string | text | Nu |
| `entrance` | string | text | Nu |
| `floor` | string | text | Nu |
| `iban` | string | text | Nu |
| `id` | integer | integer | Da (NOT NULL) |
| `industry` | string | text | Nu |
| `is_active` | integer | integer | Nu |
| `is_tva_payer` | integer | integer | Nu |
| `last_contact` | integer | bigint | Nu |
| `lead_score` | integer | integer | Nu |
| `name` | string | text | Da (NOT NULL) |
| `notes` | string | text | Nu |
| `phone` | string | text | Nu |
| `photo_path` | string | text | Nu |
| `reg_com` | string | text | Nu |
| `representative` | string | text | Nu |
| `source` | string | text | Nu |
| `status` | string | text | Nu |
| `street` | string | text | Nu |
| `street_number` | string | text | Nu |
| `tags` | string | text | Nu |
| `value_avg` | number | real | Nu |
| `website` | string | text | Nu |

## company_settings

| Nume coloană | Tip de date | Format | Obligatoriu (NOT NULL) |
| --- | --- | --- | --- |
| `address` | string | text | Nu |
| `bank_account` | string | text | Nu |
| `bank_name` | string | text | Nu |
| `company_email` | string | text | Nu |
| `company_name` | string | text | Nu |
| `company_phone` | string | text | Nu |
| `company_representative` | string | text | Nu |
| `cui` | string | text | Nu |
| `email` | string | text | Nu |
| `gmail_token` | string | text | Nu |
| `id` | integer | integer | Da (NOT NULL) |
| `logo_base64` | string | text | Nu |
| `phone` | string | text | Nu |
| `reg_com` | string | text | Nu |

## contracts

| Nume coloană | Tip de date | Format | Obligatoriu (NOT NULL) |
| --- | --- | --- | --- |
| `client_id` | integer | integer | Nu |
| `content` | string | text | Nu |
| `currency` | string | text | Nu |
| `date` | integer | bigint | Nu |
| `delivery_terms` | string | text | Nu |
| `id` | integer | integer | Da (NOT NULL) |
| `number` | integer | integer | Nu |
| `payment_terms` | string | text | Nu |
| `source_doc_id` | integer | integer | Nu |
| `source_doc_type` | string | text | Nu |
| `total` | number | numeric | Nu |
| `warranty_terms` | string | text | Nu |

## invoices

| Nume coloană | Tip de date | Format | Obligatoriu (NOT NULL) |
| --- | --- | --- | --- |
| `advance_percentage` | number | real | Nu |
| `anaf_id` | string | text | Nu |
| `anaf_status` | string | text | Nu |
| `client_id` | integer | integer | Nu |
| `currency` | string | text | Nu |
| `date` | integer | bigint | Nu |
| `due_date` | integer | bigint | Nu |
| `exchange_rate` | number | real | Nu |
| `id` | integer | integer | Da (NOT NULL) |
| `number` | integer | integer | Nu |
| `offer_id` | integer | integer | Nu |
| `original_invoice_id` | integer | integer | Nu |
| `payment_conditions` | string | text | Nu |
| `pdf_path` | string | text | Nu |
| `products_json` | string | text | Nu |
| `proforma_id` | integer | integer | Nu |
| `series` | string | text | Nu |
| `status` | string | text | Nu |
| `total` | number | real | Nu |
| `type` | string | text | Nu |
| `xml_path` | string | text | Nu |

## leads

| Nume coloană | Tip de date | Format | Obligatoriu (NOT NULL) |
| --- | --- | --- | --- |
| `county` | string | text | Nu |
| `created_at` | string | timestamp with time zone | Da (NOT NULL) |
| `crops` | array<string> | text[] | Nu |
| `email` | string | text | Nu |
| `fuel_savings` | number | numeric | Nu |
| `hectares` | number | numeric | Nu |
| `id` | string | uuid | Da (NOT NULL) |
| `last_contacted` | string | timestamp with time zone | Nu |
| `name` | string | text | Da (NOT NULL) |
| `notes` | string | text | Nu |
| `phone` | string | text | Nu |
| `source` | string | text | Nu |
| `status` | string | text | Nu |
| `subsidy_income` | number | numeric | Nu |
| `total_benefit` | number | numeric | Nu |
| `urgency` | string | text | Nu |

## logs

| Nume coloană | Tip de date | Format | Obligatoriu (NOT NULL) |
| --- | --- | --- | --- |
| `action` | string | text | Nu |
| `client_id` | integer | integer | Nu |
| `timestamp` | integer | bigint | Nu |

## offers

| Nume coloană | Tip de date | Format | Obligatoriu (NOT NULL) |
| --- | --- | --- | --- |
| `client_id` | integer | integer | Nu |
| `currency` | string | text | Nu |
| `date` | integer | bigint | Nu |
| `exchange_rate` | number | real | Nu |
| `id` | integer | integer | Da (NOT NULL) |
| `items_json` | string | text | Nu |
| `pdf_path` | string | text | Nu |
| `status` | string | text | Nu |
| `title` | string | text | Nu |
| `total` | number | real | Nu |
| `valid_until` | integer | bigint | Nu |

## products

| Nume coloană | Tip de date | Format | Obligatoriu (NOT NULL) |
| --- | --- | --- | --- |
| `category` | string | text | Nu |
| `code` | string | text | Da (NOT NULL) |
| `currency` | string | text | Nu |
| `id` | integer | integer | Da (NOT NULL) |
| `name` | string | text | Da (NOT NULL) |
| `photo_path` | string | text | Nu |
| `price` | number | real | Da (NOT NULL) |
| `specs` | string | text | Nu |
| `stock` | integer | integer | Nu |

## proformas

| Nume coloană | Tip de date | Format | Obligatoriu (NOT NULL) |
| --- | --- | --- | --- |
| `advance_percentage` | number | real | Nu |
| `client_id` | integer | integer | Nu |
| `currency` | string | text | Nu |
| `date` | integer | bigint | Nu |
| `due_date` | integer | bigint | Nu |
| `exchange_rate` | number | real | Nu |
| `id` | integer | integer | Da (NOT NULL) |
| `items_json` | string | text | Nu |
| `number` | integer | integer | Nu |
| `offer_id` | integer | integer | Nu |
| `payment_conditions` | string | text | Nu |
| `pdf_path` | string | text | Nu |
| `series` | string | text | Nu |
| `status` | string | text | Nu |
| `total` | number | real | Nu |

## reports

| Nume coloană | Tip de date | Format | Obligatoriu (NOT NULL) |
| --- | --- | --- | --- |
| `data_json` | string | text | Nu |
| `export_date` | integer | bigint | Nu |
| `id` | integer | integer | Da (NOT NULL) |
| `period` | string | text | Nu |
| `type` | string | text | Nu |

## settings

| Nume coloană | Tip de date | Format | Obligatoriu (NOT NULL) |
| --- | --- | --- | --- |
| `key` | string | text | Da (NOT NULL) |
| `value` | string | text | Nu |

## users

| Nume coloană | Tip de date | Format | Obligatoriu (NOT NULL) |
| --- | --- | --- | --- |
| `created_at` | string | timestamp with time zone | Nu |
| `full_name` | string | text | Nu |
| `id` | integer | bigint | Da (NOT NULL) |
| `is_active` | boolean | boolean | Nu |
| `password` | string | text | Da (NOT NULL) |
| `role` | string | text | Da (NOT NULL) |
| `username` | string | text | Da (NOT NULL) |

## verbal_processes

| Nume coloană | Tip de date | Format | Obligatoriu (NOT NULL) |
| --- | --- | --- | --- |
| `client_id` | integer | integer | Nu |
| `commission_members` | string | text | Nu |
| `conclusions` | string | text | Nu |
| `contract_id` | integer | integer | Nu |
| `date` | integer | bigint | Nu |
| `documents` | string | text | Nu |
| `id` | integer | integer | Da (NOT NULL) |
| `location` | string | text | Nu |
| `number` | integer | integer | Nu |
| `observations` | string | text | Nu |
| `type` | string | text | Nu |

---

## Anexă: coloane setate de site la `client_tasks`

Surse: `src/app/api/leads/route.ts`. Orice altă coloană (ex. responsabil, notificări) lipsește din site și se completează în CRM sau prin trigger.

| Nume coloană | Setare din API |
| --- | --- |
| `client_id` | ID client creat / găsit la duplicat |
| `title` | `🚨 LEAD NOU: Cerere ofertă website` |
| `description` | Text compilat: sursă, produs, mesaj, hectare, culturi, urgență, estimări ROI |
| `due_date` | `Date.now()` + 3 zile, ISO string (`toISOString()`) |
| `status` | `'Nou'` |
| `resolution` | `'EMPTY'` |
| `is_completed` | `0` (integer, nu boolean) |
