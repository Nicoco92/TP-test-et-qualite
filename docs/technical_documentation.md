# Documentation Technique — Student Course API

## 1. Présentation du projet

Le projet **Student Course API** est une API REST développée en **Node.js** et **Express** permettant la gestion des étudiants, des cours, et des inscriptions.  
Elle est accompagnée d’une documentation interactive via **Swagger**, de tests automatisés avec **Jest**, et d’une intégration continue avec **GitHub Actions**.  
La qualité du code est surveillée par **ESLint**, **Prettier**, et **Codacy**.

---

## 2. Objectifs

- Créer une API simple et structurée pour gérer :
  - Les **cours** (création, suppression, mise à jour)
  - Les **étudiants**
  - Les **inscriptions (enrollments)** entre étudiants et cours
- Fournir une **documentation API** via Swagger.
- Mettre en place des **tests unitaires et d’intégration**.
- Automatiser les **vérifications de qualité et de couverture de code**.

---

## 3. Architecture du projet

```
student-course-api/
│
├── src/
│   ├── app.js                  # Configuration principale de l’application Express
│   ├── routes/
│   │   ├── courses.js          # Routes liées aux cours
│   │   └── students.js         # Routes liées aux étudiants
│   ├── controllers/
│   │   ├── coursesController.js
│   │   └── studentsController.js
│   └── services/
│       └── storage.js          # Gestion du stockage et de la logique d’association
│
├── tests/
│   ├── unit/                   # Tests unitaires
│   ├── integration/            # Tests d’intégration
│   └── ...
│
├── .github/
│   ├── workflows/ci.yml        # Workflow GitHub Actions (CI/CD)
│   └── pull_request_template.md
│
├── docs/
│   └── technical_documentation.md
│
├── .eslintrc.js
├── .prettierrc
├── package.json
└── README.md
```

---

## 4. Technologies utilisées

| Catégorie          | Outils / Librairies                              |
| ------------------ | ------------------------------------------------ |
| Backend            | Node.js, Express                                 |
| Documentation      | Swagger (via swagger-jsdoc & swagger-ui-express) |
| Tests              | Jest, Supertest                                  |
| Qualité            | ESLint, Prettier, Codacy                         |
| CI/CD              | GitHub Actions                                   |
| Format des données | JSON                                             |

---

## 5. Installation et exécution

### Prérequis

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
git clone https://github.com/Nicoco92/TP-test-et-qualite
npm install
```

### Lancer le serveur

```bash
npm start
```

Serveur lancé sur :  
 [http://localhost:3000](http://localhost:3000)

---

## 6. Tests et couverture

Lancer tous les tests :

```bash
npm test
```

Générer un rapport de couverture :

```bash
npm test -- --coverage
```

Les tests couvrent :

- Les **contrôleurs** (`coursesController`, `studentsController`)
- Les **fonctions de service** (`storage.js`)
- Les **erreurs et statuts HTTP** (404, 400, 500)

---

## 7. Linting & Formatage

### Vérifier la qualité du code

```bash
npm run lint
```

### Corriger automatiquement les erreurs

```bash
npm run lint --fix
```

### Formater le code

```bash
npx prettier --write .
```

---

## 8. Intégration continue (CI/CD)

### Fichier `.github/workflows/ci.yml`

Le workflow effectue les étapes suivantes à chaque **push ou pull request** sur `main` :

1. Installe les dépendances
2. Vérifie le code avec ESLint
3. Lance les tests Jest avec couverture
4. Upload la couverture à Codacy
5. Archive le rapport de test

Exemple :

```yaml
- name: Upload coverage to Codacy
  run: npx codacy-coverage < coverage/lcov.info
  env:
    CODACY_PROJECT_TOKEN: ${{ secrets.CODACY_PROJECT_TOKEN }}
```

---

## 9. Documentation Swagger

Accessible à l’adresse :  
**http://localhost:3000/api-docs**

### Exemple de route

#### POST `/courses`

Crée un nouveau cours.

**Body :**

```json
{
  "title": "Mathématiques",
  "teacher": "Mme Dupont"
}
```

**Réponse :**

```json
{
  "id": 1,
  "title": "Mathématiques",
  "teacher": "Mme Dupont"
}
```

#### GET `/students/:id`

Retourne un étudiant et ses cours associés.

**Réponse :**

```json
{
  "student": {
    "id": 3,
    "name": "Alice Martin",
    "email": "alice@example.com"
  },
  "courses": [{ "id": 1, "title": "Mathématiques", "teacher": "Mme Dupont" }]
}
```

---

## 10. Structure des données

### Exemple : `Course`

```json
{
  "id": 1,
  "title": "Informatique",
  "teacher": "M. Bernard"
}
```

### Exemple : `Student`

```json
{
  "id": 3,
  "name": "Alice Martin",
  "email": "alice@example.com"
}
```

### Exemple : `Enrollment`

```json
{
  "studentId": 3,
  "courseId": 1
}
```

---

## 11. Gestion des erreurs

| Code | Description            | Exemple                                     |
| ---- | ---------------------- | ------------------------------------------- |
| 400  | Paramètres invalides   | `{ "error": "title and teacher required" }` |
| 404  | Ressource non trouvée  | `{ "error": "Course not found" }`           |
| 500  | Erreur interne serveur | `{ "error": "Internal Server Error" }`      |

---

## 12. Contrôle de qualité (Codacy)

- **Analyse du code** à chaque commit
- **Notation de qualité**
- **Mesure de la couverture Jest**
- **Détection des duplications, complexité et erreurs potentielles**

## 13. Bonnes pratiques adoptées

- Respect des conventions ESLint + Prettier
- Structure MVC (Model–View–Controller)
- Séparation claire des responsabilités (routes / contrôleurs / services)
- Tests automatisés (unitaires + intégration)
- CI/CD automatisé avec GitHub Actions
- Documentation Swagger intégrée

## 14. Auteurs

**Nicolas Contreras Tibocha**

### Conclusion

Cette documentation regroupe toutes les informations techniques nécessaires pour comprendre, installer, exécuter, tester et maintenir le projet **Student Course API**.  
Elle démontre une approche complète de développement moderne, intégrant :

- la qualité de code,
- les tests,
- la documentation automatique,
- et l’intégration continue.
