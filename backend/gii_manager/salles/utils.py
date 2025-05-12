import random

def get_positions(nb_rangees, nb_colonnes):
    positions = []

    for i in range(nb_rangees):
        for j in range(nb_colonnes):
                positions.append((i, j))
    return positions


def placer_etudiants_dans_salle(etudiants, nb_rangees, nb_colonnes):
    grille = [[None for _ in range(nb_colonnes)] for _ in range(nb_rangees)]

    eleves = [e for e in etudiants if e.tag == "élevé"]
    faibles = [e for e in etudiants if e.tag == "faible"]
    autres = [e for e in etudiants if e.tag not in ["élevé", "faible"]]
    random.shuffle(autres)

    positions = get_positions(nb_rangees, nb_colonnes)

    def assign_students(students, pos_list):
        for pos in pos_list:
            if not students:
                break
            i, j = pos
            if grille[i][j] is None:
                grille[i][j] = students.pop(0)

    assign_students(eleves, positions)
    assign_students(autres, positions)
    assign_students(faibles, reversed(positions))

    return grille
