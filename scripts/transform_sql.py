def replace_uuid_with_int(input_str):
    # Split the string by tab
    fields = input_str.split('\t')
    
    counter = 1
    uuid_to_int_map = {}
    
    # For each field, check if it looks like a UUID, and replace
    for i, field in enumerate(fields):
        if is_uuid(field):
            if field not in uuid_to_int_map:
                uuid_to_int_map[field] = counter
                counter += 1
            fields[i] = str(uuid_to_int_map[field])
    
    # Join back together with tabs and return
    return '\t'.join(fields)

def is_uuid(value):
    try:
        # Check length and basic structure to see if it might be a UUID
        if len(value) == 36 and value.count('-') == 4:
            return True
    except:
        pass
    return False

if __name__ == "__main__":
    # Sample input for testing
    input_str = """
    12eadaed-d73f-4135-a5c2-ff13caaa447b	2022-11-15 20:07:46.752+01	t	t	4	1	Classique tu connais 	2022-11-15 20:07:46.752+01	2022-11-15 20:07:46.752+01
15eadaed-d73f-4135-a5c2-ff13caaa447b	2022-11-15 20:09:34.789+01	f	t	2	31	Copain Copain avec l'arbitre	2022-11-15 20:09:34.789+01	2022-11-15 20:09:34.789+01
16eadaed-d73f-4135-a5c2-ff13caaa447b	2022-11-15 20:10:06.323+01	f	t	1	31	Cadeau d'un ami 	2022-11-15 20:10:06.323+01	2022-11-15 20:10:06.323+01
    """
    
    print(replace_uuid_with_int(input_str))
